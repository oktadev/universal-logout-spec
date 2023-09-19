# Okta API developer portal

This contains the Redoc.ly developer portal implementation of Okta's API reference documentation. It uses a set of OpenAPI 3.0 specifications, markdown files, and a set of product customization toggles and custom CSS.

## Getting Started

### Prerequisites

- [node.js >= 12.22.6](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/)

### Install

    yarn install

### Start development server

    yarn start

Note: Search isn't functional in the development environment.

### Troubleshooting

We heavily rely on caching for performance issues so if some changes aren't reflected in the resulting portal, try cleaning cache by running:

    yarn clean

### Redocly ocs

Read the [online documentation](https://redoc.ly/docs/reference/introduction/) for the Redoc.ly developer portal.
