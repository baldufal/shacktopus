# Check if an argument is provided
if ($args.Count -eq 0) {
    Write-Host "Usage: script.ps1 [frontend|backend|all]"
    exit 1
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "Remember to place certificates in shacktopus/cert/ and shacktopus/nginx/certs/"
    Write-Host "Rebuilding and redeploying frontend..."
    docker-compose build frontend
    docker-compose up -d frontend
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host "Remember to provide a valid reef/config/config.json"
    Write-Host "Rebuilding and redeploying backend..."
    docker-compose build backend
    docker-compose up -d backend
}

# Conditional logic based on argument
switch ($args[0]) {
    'frontend' {
        Deploy-Frontend
    }
    'backend' {
        Deploy-Backend
    }
    'all' {
        Deploy-Frontend
        Deploy-Backend
    }
    default {
        Write-Host "Invalid argument. Usage: script.ps1 [frontend|backend|all]"
        exit 1
    }
}
