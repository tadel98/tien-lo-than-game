#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Auto Deploy Script Started');
console.log('⏰ Waiting 5 hours before deployment...');

// Function to check if deployment is needed
function checkDeploymentNeeded() {
  try {
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
    const importantPaths = [
      'pages/', 'components/', 'stores/', 'server/', 
      'composables/', 'utils/', 'prisma/', 'nuxt.config',
      'package.json', 'vercel.json', 'tailwind.config', 
      'app.vue', 'assets/'
    ];
    
    const hasImportantChanges = changedFiles
      .split('\n')
      .some(file => importantPaths.some(path => file.startsWith(path)));
    
    return hasImportantChanges;
  } catch (error) {
    console.log('⚠️  Could not check git changes, proceeding with deployment');
    return true;
  }
}

// Function to deploy to Vercel
function deployToVercel() {
  try {
    console.log('🔧 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('🚀 Deploying to Vercel...');
    execSync('vercel --prod --confirm', { stdio: 'inherit' });
    
    console.log('✅ Deployment completed successfully!');
    
    // Log deployment time
    const deploymentLog = {
      timestamp: new Date().toISOString(),
      status: 'success',
      message: 'Auto deployment completed after 5 hours'
    };
    
    fs.writeFileSync(
      path.join(__dirname, '..', 'deployment-log.json'), 
      JSON.stringify(deploymentLog, null, 2)
    );
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    
    // Log error
    const errorLog = {
      timestamp: new Date().toISOString(),
      status: 'error',
      message: error.message
    };
    
    fs.writeFileSync(
      path.join(__dirname, '..', 'deployment-error.json'), 
      JSON.stringify(errorLog, null, 2)
    );
    
    process.exit(1);
  }
}

// Main function
async function main() {
  // Wait 5 hours (5 * 60 * 60 * 1000 milliseconds)
  const fiveHours = 5 * 60 * 60 * 1000;
  
  console.log('⏳ Waiting 5 hours...');
  console.log('🕐 Current time:', new Date().toLocaleString());
  console.log('🕐 Deploy time:', new Date(Date.now() + fiveHours).toLocaleString());
  
  // Wait 5 hours
  await new Promise(resolve => setTimeout(resolve, fiveHours));
  
  console.log('⏰ 5 hours have passed!');
  console.log('🔍 Checking if deployment is needed...');
  
  if (checkDeploymentNeeded()) {
    console.log('✅ Deployment needed, proceeding...');
    deployToVercel();
  } else {
    console.log('ℹ️  No important changes detected, skipping deployment');
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Process interrupted. Deployment cancelled.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Process terminated. Deployment cancelled.');
  process.exit(0);
});

// Start the process
main().catch(error => {
  console.error('❌ Auto deploy script failed:', error);
  process.exit(1);
});
