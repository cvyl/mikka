---
title: Automating Deployment for Laravel Using Deployer and GitHub Actions
description: A small guide on setting up automated deployments for Laravel projects using Deployer and GitHub Actions, including staging and production workflows and handling post-deployment tasks like migrating and restarting services.
category: Article
tags: [saas, apprenticeship, programming]
date: 2024-09-16 16:58:37
comment: false
toc: true
---

## Overview

In this note, we outline how to automate the deployment process for a Laravel project using **Deployer** and **GitHub Actions**. The setup covers deploying to both **staging** and **production** environments, with different workflows for each environment. We also integrate post-deployment tasks such as migrating and restarting queues using **Supervisor**.

## Prerequisites

Before setting up this automation, ensure the following:

- **Deployer** is installed in your Laravel project (`composer require deployer/deployer --dev`).
- The **deploy.php** configuration file is created in the root of your project.
- SSH keys are set up correctly between GitHub Actions and your server for secure deployment.

## Deployment Setup

### Step 1: Creating the `deploy.php` File

The `deploy.php` file is essential for configuring Deployer. It defines the repository, shared directories, writable directories, and host settings for staging and production environments. Below is an example.

```php
<?php
namespace Deployer;

require 'recipe/laravel.php';

// Project repository
set('repository', 'git@github.com:your-username/your-repo.git');

// Shared files/dirs between deploys
add('shared_files', ['.env']);
add('shared_dirs', ['node_modules', 'vendor']);

// Writable dirs by web server
add('writable_dirs', []);

// Hosts
host('staging')
 ->set('hostname','IP')
 ->set('remote_user', 'deployer')
 ->set('branch', 'staging')
 ->set('deploy_path', '/var/www/staging');

host('production')
 ->set('hostname','IP')
 ->set('remote_user', 'deployer')
 ->set('branch', 'main')
 ->set('deploy_path', '/var/www/production');

// Tasks
desc('Restart PHP-FPM service');
task('php-fpm:restart', function () {
 run('sudo systemctl restart php7.4-fpm');
});

desc('Restart supervisor service');
task('supervisor:restart', function () {
 run('sudo supervisorctl reread');
 run('sudo supervisorctl update');
 run('sudo supervisorctl restart all');
});

// Hooks
after('deploy:symlink', 'php-fpm:restart');
after('deploy:symlink', 'artisan:migrate');
after('deploy:symlink', 'supervisor:restart');
```

### Step 2: GitHub Actions Workflow

#### Staging Workflow (`staging-deploy.yml`)

The following is an example of a GitHub Actions workflow file for deploying to the **staging** environment.

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - staging

jobs:
  deploy:
    name: Deploy to Staging
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Install PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'

      - name: Install Composer Dependencies
        run: composer install --no-progress --no-interaction --prefer-dist --optimize-autoloader

      - name: Deploy to Staging
        uses: deployphp/action@v1
        with:
          private-key: ${{ secrets.SSH_KEY }}
          dep: deploy staging
```

#### Production Workflow (`production-deploy.yml`)

The production workflow is similar but triggers on pushes to the **main** branch.

### Step 3: Testing and Troubleshooting

#### Common Errors

1. **`No host selected`**: This error occurs when Deployer cannot find the host based on the command selector. Make sure you pass the correct host (either `staging` or `production`) when deploying.

   ```bash
   ./vendor/bin/dep deploy staging
   ```

2. **`Call to undefined method`**: This error may appear if you're using the wrong Deployer version or method. In our case, ensure you're following the Deployer 7.x documentation.

### Step 4: Post-Deployment Tasks

1. **Running Migrations**: We use the `artisan:migrate` command to ensure that migrations are run automatically after deployment.

2. **Restarting Queues**: If changes to the queue system are deployed, it's essential to restart the queue workers. We achieve this by running `artisan:queue:restart` after deployment.

3. **Restarting Supervisor**: If you're managing workers using **Supervisor**, the deployment process includes commands to restart Supervisor with `supervisorctl`.

---

## Summary

By combining **Deployer** and **GitHub Actions**, we’ve automated the deployment process for a Laravel project across both staging and production environments. This approach ensures the project is deployed and migrations are run automatically, and queue workers are restarted when necessary. The process is both scalable and adaptable for future projects.

## Sources

1. **Deployer Documentation: Hosts in Deployer 7.x**  
   [https://deployer.org/docs/7.x/hosts](https://deployer.org/docs/7.x/hosts)

2. **Deployer GitHub Action**  
   [https://github.com/deployphp/action](https://github.com/deployphp/action)

3. **Deployer Official Documentation: Version 7.x**  
   [https://deployer.org/docs/7.x/](https://deployer.org/docs/7.x/)

4. **GitHub Actions Documentation: Workflow Syntax**  
   [https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
