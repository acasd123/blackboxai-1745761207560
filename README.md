# Appius - Website Builder SaaS Platform

Appius is a production-ready, multi-tenant website builder SaaS platform that enables users to create and manage professional websites with ease.

## Features

- 🎨 Drag-and-drop page editor
- 🎯 5 starter templates (minimalist, creative, corporate, portfolio, e-commerce)
- 🛍️ Built-in e-commerce functionality
- 🔒 Multi-tenant architecture with schema-per-tenant
- 🌐 Custom domain support with automated SSL
- 💳 Subscription-based billing with Stripe
- 📱 Mobile-first, responsive design
- ♿ WCAG 2.1 AA compliant

## Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- @craftjs/core for drag-and-drop
- TypeScript

### Backend
- Node.js with Express
- PostgreSQL (schema-per-tenant)
- Redis caching
- TypeScript

### Infrastructure
- Kubernetes deployment
- Terraform for infrastructure
- GitHub Actions CI/CD
- Global CDN (Cloudflare)

## Getting Started

### Prerequisites
- Node.js 18+
- Docker
- kubectl
- Terraform

### Local Development

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-org/appius.git
cd appius
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Start development servers:
\`\`\`bash
npm run dev
\`\`\`

The development server will start at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Swagger docs: http://localhost:4000/api-docs

### Production Deployment

1. Build Docker images:
\`\`\`bash
make build
\`\`\`

2. Deploy to Kubernetes:
\`\`\`bash
cd infra/k8s
kubectl apply -f .
\`\`\`

## Documentation

- [API Documentation](./docs/api.md)
- [Architecture Overview](./docs/architecture.md)
- [Development Guide](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)

## Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit your changes: \`git commit -m 'Add amazing feature'\`
4. Push to the branch: \`git push origin feature/amazing-feature\`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@appius.com or join our Slack community.
