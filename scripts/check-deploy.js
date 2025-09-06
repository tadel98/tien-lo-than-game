#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking if deployment is needed...');

// Function to check if deployment is needed
function checkDeploymentNeeded() {
  try {
    // Get list of changed files
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
    
    console.log('📁 Changed files:');
    console.log(changedFiles);
    
    // Define important paths that require deployment
    const importantPaths = [
      'pages/', 'components/', 'stores/', 'server/', 
      'composables/', 'utils/', 'prisma/', 'nuxt.config',
      'package.json', 'vercel.json', 'tailwind.config', 
      'app.vue', 'assets/'
    ];
    
    // Check if any changed file matches important paths
    const hasImportantChanges = changedFiles
      .split('\n')
      .filter(file => file.trim() !== '')
      .some(file => {
        const matches = importantPaths.some(importantPath => 
          file.startsWith(importantPath) || file.includes(importantPath)
        );
        if (matches) {
          console.log(`✅ Important change detected: ${file}`);
        }
        return matches;
      });
    
    return hasImportantChanges;
  } catch (error) {
    console.log('⚠️  Could not check git changes:', error.message);
    console.log('ℹ️  Proceeding with deployment check...');
    return true;
  }
}

// Function to check Vercel status
function checkVercelStatus() {
  try {
    console.log('🔍 Checking Vercel status...');
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is available');
    return true;
  } catch (error) {
    console.log('❌ Vercel CLI not found or not logged in');
    console.log('💡 Run: npm install -g vercel && vercel login');
    return false;
  }
}

// Function to check if we're in a git repository
function checkGitStatus() {
  try {
    execSync('git status', { stdio: 'pipe' });
    console.log('✅ Git repository detected');
    return true;
  } catch (error) {
    console.log('❌ Not in a git repository');
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 Deployment Check Tool');
  console.log('========================');
  
  // Check git status
  if (!checkGitStatus()) {
    console.log('❌ Cannot proceed without git repository');
    process.exit(1);
  }
  
  // Check Vercel status
  const vercelAvailable = checkVercelStatus();
  
  // Check if deployment is needed
  const needsDeployment = checkDeploymentNeeded();
  
  console.log('\n📊 Deployment Analysis:');
  console.log('========================');
  
  if (needsDeployment) {
    console.log('✅ DEPLOYMENT NEEDED');
    console.log('📝 Reason: Important files have been changed');
    
    if (vercelAvailable) {
      console.log('\n🚀 Available deployment options:');
      console.log('  • npm run deploy:now     - Deploy immediately');
      console.log('  • npm run deploy:5h      - Deploy after 5 hours');
      console.log('  • npm run deploy:delayed - Deploy with custom delay');
    } else {
      console.log('\n⚠️  Vercel CLI not available');
      console.log('💡 Install and login to Vercel first');
    }
  } else {
    console.log('ℹ️  NO DEPLOYMENT NEEDED');
    console.log('📝 Reason: No important files have been changed');
    console.log('💡 Only documentation, tests, or logs were modified');
  }
  
  // Save check result
  const checkResult = {
    timestamp: new Date().toISOString(),
    needsDeployment,
    vercelAvailable,
    gitAvailable: true
  };
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'deployment-check.json'), 
    JSON.stringify(checkResult, null, 2)
  );
  
  console.log('\n📄 Check result saved to: deployment-check.json');
  
  return needsDeployment;
}

// Run the check
main();
