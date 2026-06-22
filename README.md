# Magic Tale Website

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Docker

Build the production image:

```bash
npm run docker:build
```

Run the container locally:

```bash
npm run docker:run
```

Open `http://localhost:8080` in your browser.

If you prefer Docker directly:

```bash
docker build -t magic-tale-website .
docker run --rm -p 8080:80 magic-tale-website
```

## Deployment

1. Build the image locally.
2. Tag the image for your registry, for example:

```bash
docker tag magic-tale-website YOUR_REGISTRY/your-repo/magic-tale-website:latest
```

3. Push to your registry:

```bash
docker push YOUR_REGISTRY/your-repo/magic-tale-website:latest
```

4. Deploy the image to a container service such as:
   - Docker Hub + cloud host
   - AWS Elastic Container Service / Fargate
   - Azure Container Instances
   - Google Cloud Run
   - any Kubernetes cluster

5. Point your service to listen on port `80` and serve the container.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
