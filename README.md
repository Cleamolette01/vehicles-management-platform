# Vehicles Management Platform

## Overview

This full-stack application helps fleet managers monitor their electric vehicle fleet's efficiency and environmental impact.

## Notes

Welcome on my project. From home page, you can navigate on Dashboard Overview, Analytics Visualization and Vehicle Management.

On Vehicle Management you can view all vehicles, add a new vehicle, update a vehicle by clicking on it, sort by any column, filter by type.

I also added a CI that run unit and e2e tests.

#### Data Model

The application track vehicles with the following properties:

- ID (uuid)
- Brand (string)
- Model (string)
- Battery capacity (kWh)
- Current charge level (%)
- Status (enum: available, charging, in_use)
- Last updated (timestamp)
- Average energy consumption (kWh/100km)
- Type (BEV/ICE) - *BEV = Battery Electric Vehicle, ICE = Internal Combustion Engine*
- Emission_gco2_km - *Grams of CO2 per kilometer*

#### API Endpoints

1. **Vehicle Management**
    - GET /vehicles - List all vehicles with pagination and filtering
    - POST /vehicles - Add new vehicle
    - GET /vehicles/:id - Get vehicle details
    - PUT /vehicles/:id - Update vehicle
    - DELETE /vehicles/:id - Remove vehicle
2. **Analytics**
    - GET /analytics/fleet-efficiency
        - Average energy consumption rates across different models
        - Emissions comparison between BEV and ICE vehicles
    - GET /analytics/fleet-composition
        - Distribution of BEV vs. ICE vehicles
    - GET /analytics/fleet-operational
        - Current fleet availability rate (% of vehicles available)
        - Number of vehicles currently charging vs. in use

#### Technologies used

- [NestJs](https://docs.nestjs.com/) as the backend framework
- [TypeORM](https://github.com/typeorm/typeorm) for database interactions
- Request validation using [class-validator](https://docs.nestjs.com/pipes#class-validator)
- [Redis](https://redis.io/) caching for analytics endpoints
- [ReactJS](https://react.dev/) for building the frontend user interface

# Project Setup Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+
- pnpm

## Service Ports Overview

| Service        | Internal Port | External Port | Access URL                    | Description                     |
|---------------|--------------|--------------|-------------------------------|--------------------------------|
| Frontend      | 8080         | 8000         | http://localhost:8000         | React Frontend Application     |
| Backend       | 3000         | 3000         | http://localhost:3000         | NestJS Backend API             |
| Postgres      | 5432         | 5432         | localhost:5432                | Database Service               |
| PgAdmin       | 80           | 8001         | http://localhost:8001         | Postgres Management Interface  |
| Redis         | 6379         | 6379         | localhost:6379                | Key-Value Store                |
| Redis Insight | 5540         | 8002         | http://localhost:8002         | Redis Management Interface     |

> **Note for Redis Insight**: Use the connection string `redis://default@redis:6379`

## Docker Commands

```bash
# Build all services
docker compose build

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## Development Workflow

```bash
# Install all workspace dependencies
pnpm install

# How to run a command in a specific workspace
pnpm --filter backend YOUR_COMMAND
# Or
pnpm --filter frontend YOUR_COMMAND

# Start backend first
pnpm dev:backend

# Then start frontend
pnpm dev:frontend
```

## Troubleshooting

1. Ensure Docker is running
2. Verify pnpm and Docker versions
3. Use `docker-compose logs` to inspect service startup issues

## Notes

- Default credentials are set for development
- ALWAYS change credentials in production
