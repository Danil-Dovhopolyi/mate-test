# Huntd Test Assignment

Anonymous job search in IT (test version for Mate academy candidates).

## Prerequisites

Before starting, ensure you have the required development environment set up based on your operating system.

### Windows Users (WSL Required)

For optimal Docker performance, Windows users must install WSL2:

1. **Install WSL 2**
   Follow the official guide: [Install WSL on Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

   Verify WSL 2 installation:
   ```powershell
   wsl -l -v
   ```

   Use the **latest** Ubuntu image offered.

2. **WSL Best Practices**
   - Install all development tools (Git, Node.js, Docker) on the Linux filesystem
   - Store project files on the Linux filesystem for maximum Docker performance
   - Access your WSL filesystem from Windows at `\\wsl$\Ubuntu`

### Node.js Installation (All Platforms)

Install Node.js via nvm for version management:

1. **Install nvm:**
   - **Linux/macOS:** Follow instructions at [nvm repository](https://github.com/nvm-sh/nvm)
   - **Windows (WSL):** Same as Linux instructions above

2. **Install and use Node.js:**
   ```bash
   # Check .nvmrc file in project root for required version
   nvm install
   nvm use
   ```

### Docker Installation

**macOS:**
Install [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)

**Windows:**
1. Install [Docker Desktop for Windows](https://docs.docker.com/get-docker/)
2. Configure Docker to use WSL 2 backend: [Docker Desktop WSL 2 backend](https://docs.docker.com/desktop/windows/wsl/)
3. Enable WSL 2 integration in Docker Desktop settings

**Linux:**
Follow the [official Docker installation guide](https://docs.docker.com/get-docker/) for your distribution.

## Project Setup

### 1. Clone Repository

```bash
git clone git@github.com:mate-academy/huntd-test.git
cd huntd-test
```

### 2. NPM Token Setup

You'll receive a private NPM token from Mate academy. Configure it in three places:

**Step 1: Local NPM configuration**
- **Linux/macOS/WSL:** `~/.npmrc`
- **Windows:** `C:/Users/<YourUsername>/.npmrc`

Add this line to the file:
```
//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
```

Verify the token works:
```bash
npm whoami
# Should return: mateacademy
```

**Step 2: Project environment**
```bash
# Copy environment template (.env.sample -> .env)
make init

# Edit .env file (line 4) and add:
NPM_TOKEN=YOUR_TOKEN_HERE

# Edit Makefile (line 4) and replace:
NPM_TOKEN ?= YOUR_TOKEN_HERE
```

### 3. Install Dependencies

Install packages for the main services (ensure correct Node.js version from .nvmrc):
```bash
npm install # in root directory
cd frontend && npm install && cd ..
cd api && npm install && cd ..
```

## Running the Project

### Start All Services

```bash
make up
```

This starts all services via Docker Compose:
- **Frontend:** http://localhost:3000
- **API GraphQL:** http://localhost:4000/graphql
- **API REST:** http://localhost:4000/rest
- **Database:** PostgreSQL on port 5432
- **Redis:** Port 6379

### Verify Setup

After startup, access the project at: **http://localhost:3000**

## SSL Certificate Setup (Optional)

The test assignment mentions SSL setup. This section provides complete instructions.

### 1. Modify Hosts File

**macOS/Linux:**
```bash
sudo vi /etc/hosts
```

**Windows:**
Open `C:\Windows\System32\drivers\etc\hosts` in text editor (Run as Administrator)

Add this line:
```
127.0.0.1       local.huntd.tech
```

### 2. SSL Certificate Configuration

SSL certificates are pre-generated and stored in `local-ssl/` directory. To access via HTTPS:

1. **Update environment variables in `.env`:**
   ```
   API_SSL=true
   API_HOST_PUBLIC=local.huntd.tech
   ```

2. **Trust the certificate:**
   - First, visit https://local.huntd.tech to download the certificate ([learn how](https://medium.com/@menakajain/export-download-ssl-certificate-from-server-site-url-bcfc41ea46a2))
   - Then add certificate to trusted:
     - **macOS:** [Add to Keychain](https://tosbourn.com/getting-os-x-to-trust-self-signed-ssl-certificates/)
     - **Windows:** [Install certificate](https://community.spiceworks.com/how_to/1839-installing-self-signed-ca-certificate-in-windows)

3. **Access via HTTPS:** https://local.huntd.tech

## Project Architecture

The application consists of these services:

### API
- **Codebase:** `./api`
- **GraphQL endpoint:** http://localhost:4000/graphql (primary)
- **REST endpoint:** http://localhost:4000/rest (OAuth callbacks only)
- **Technology:** Node.js, TypeScript, Sequelize, Apollo GraphQL

Useful GraphQL learning resources:
- [Beginner GraphQL Series](https://www.youtube.com/watch?v=DyvsMKsEsyE&list=PLN3n1USn4xln0j_NN9k4j5hS1thsGibKi)
- [TypeScript, Next.js and GraphQL Series](https://www.youtube.com/watch?v=kfmh2mMf3fs&list=PLN3n1USn4xlkDk8vPVtgyGG3_1eXYPrW-)

### Frontend
- **Codebase:** `./frontend`
- **Homepage:** http://localhost:3000
- **Technology:** Next.js, React, TypeScript, Apollo Client, SCSS

Learn more: [Next.js Documentation](https://nextjs.org/docs)

### CMS (Production only - not required for test assignment)
- **Codebase:** `./cms`
- **Technology:** Strapi CMS
- **Note:** Not included in local development setup for simplified testing

### Database
- **Technology:** PostgreSQL 10.21
- **Port:** 5432
- **Credentials:** user: `dev`, password: `772184`, database: `huntd_development`

### Redis
- **Port:** 6379
- **Usage:** PubSub server for real-time features

### Nginx
- **Codebase:** `./nginx`
- **Purpose:** Reverse proxy, SSL termination
- **Configuration:** nginx.local.conf (for development)

## Development Commands

### Makefile Commands

```bash
# Start project
make up

# Stop project
make down

# Rebuild service after adding dependencies
make rebuild-hard s=<service>

# Run tests
make test s=<service>

# Connect to database
make db-development

# Clean Docker resources (when "No space left" error)
make clean

# Access service containers
make api    # Access API container
make front  # Access Frontend container
```

### Daily Workflow

1. **Adding dependencies:** Always rebuild the service container after adding packages:
   ```bash
   make rebuild-hard s=api        # After adding API dependencies
   make rebuild-hard s=frontend   # After adding Frontend dependencies
   ```

2. **Database changes:** **Important: Only run migrations inside the Docker container, never from outside.**
   ```bash
   make api
   npx sequelize db:migrate
   ```

## Troubleshooting

### Docker Issues on Windows

If you encounter database connection issues:
1. Ensure WSL 2 is properly installed and configured
2. Verify Docker Desktop is using WSL 2 backend
3. Check that project files are stored on WSL filesystem (not Windows)
4. In API configuration, ensure database host is set correctly (usually `db` in Docker Compose)

### NPM Token Issues

If you see 404 errors for mate-academy packages:
1. Verify `npm whoami` returns `mateacademy`
2. Check token is correctly set in all three locations: `~/.npmrc`, `.env`, and `Makefile`
3. Ensure token doesn't have extra spaces or characters

### Performance Issues

If the project runs slowly:
1. **Windows:** Ensure you're using WSL 2 and files are on Linux filesystem
2. **macOS:** Close unnecessary applications to free up memory
3. **All platforms:** Run `make clean` to free up Docker resources ⚠️ **Warning: This removes ALL Docker images and volumes system-wide, not just this project**

### Port Conflicts

If ports are already in use:
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :4000
lsof -i :5432

# Stop conflicting processes or modify docker-compose.yml ports
```

---

**Ready to start coding!** 🚀 The project should now be running at http://localhost:3000
