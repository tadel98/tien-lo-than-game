#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Immediate Deploy Script Started');

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
      message: 'Immediate deployment completed'
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
function main() {
  console.log('🔍 Checking if deployment is needed...');
  
  if (checkDeploymentNeeded()) {
    console.log('✅ Deployment needed, proceeding...');
    deployToVercel();
  } else {
    console.log('ℹ️  No important changes detected, skipping deployment');
  }
}

// Start the process
main();
