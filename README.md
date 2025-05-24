# Urban Farming Management System (UFMS)

A comprehensive solution for managing Rwandan urban farms, optimizing resource utilization, tracking crop cycles, and facilitating produce distribution to clients with a focus on sustainability metrics and efficient operations.

## 🌱 Overview

The Urban Farming Management System is designed to revolutionize urban agriculture in Rwanda by providing farmers with tools to track crop lifecycles, manage resources efficiently, coordinate staff activities, and streamline client order fulfillment while maintaining comprehensive sustainability metrics.

## ✨ Key Features

### 🏡 Farm Management
- **Multi-farm tracking** with unique identifiers and mapping
- **Visual planting area management** with crop rotation optimization
- **Staff assignment** and farm-specific task allocation
- **Interactive mapping** of farm locations and planting areas

### 🌾 Crop Management
- **Complete lifecycle tracking** from planting to harvest
- **Growing conditions monitoring** (light, temperature, humidity)
- **Automated yield tracking** and quality assessment
- **Harvest scheduling** with inventory integration

### 👥 Staff & Volunteer Coordination
- **Personnel management** with profiles and schedules
- **Task assignment** and completion tracking
- **Performance evaluation** and contribution recording
- **Workload optimization** across multiple farms

### 📊 Sustainability Metrics
- **Resource usage monitoring** (water, energy, soil health)
- **Environmental impact assessment** and reporting
- **Efficiency metrics** calculation per crop and farm
- **Cross-farm performance comparison**

### 📦 Inventory Management
- **Real-time produce tracking** with quality metrics
- **FIFO inventory management** for freshness optimization
- **Automated stock updates** from harvest data
- **Low stock alerts** and movement history

### 🛒 Order & Client Management
- **Client order processing** with delivery tracking
- **Order fulfillment** linked to available inventory
- **Client relationship management** with preferences tracking
- **Delivery scheduling** and satisfaction metrics

![Editor _ Mermaid Chart-2025-05-21-153157](https://github.com/user-attachments/assets/de5718bb-c987-409a-9685-2b75b5aef0c4)

## 🏗️ Technical Architecture

### Backend
- **Spring Boot** (Latest stable version)
- **RESTful API** design with proper resource mapping
- **Spring Data JPA** for database operations
- **Spring Security** with JWT authentication
- **PostgreSQL/MySQL** database with Redis caching

### Frontend
- **React.js** Single Page Application
- **Redux/Context API** for state management
- **Material-UI/Bootstrap** responsive design
- **Chart.js/D3.js** for data visualization
- **Leaflet/Google Maps API** for mapping

### DevOps
- **Docker** containerization
- **CI/CD** pipeline (GitHub Actions/Jenkins)
- **Cloud deployment** (AWS/GCP/Azure)
- **Environment-specific** configurations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Java 17 or higher
- PostgreSQL/MySQL
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/urban-farming-management-system.git
   cd urban-farming-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb ufms_db
   
   # Run migrations
   cd backend
   ./mvnw flyway:migrate
   ```

### Docker Setup (Alternative)
```bash
docker-compose up -d
```

## 📋 API Documentation

Once the application is running, access the API documentation at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:e2e
```

### Integration Tests
```bash
./mvnw integration-test
```

## 🛣️ Development Roadmap

### Phase 1: Core Infrastructure (4-6 weeks)
- [x] Database schema design
- [x] Authentication system
- [x] Basic API endpoints
- [x] React application setup

### Phase 2: Operational Features (6-8 weeks)
- [ ] Staff and task management
- [ ] Crop lifecycle tracking
- [ ] Inventory management
- [ ] Sustainability metrics
- [ ] Dashboard implementation

### Phase 3: Advanced Capabilities (8-10 weeks)
- [ ] Order management system
- [ ] Advanced analytics
- [ ] Mobile optimization
- [ ] Notification system
- [ ] Export functionalities

## 📈 Success Metrics

- **Increased crop yield** per square foot
- **Reduced resource waste** (water, energy, soil amendments)
- **Improved staff productivity** and task completion rates
- **Enhanced client satisfaction** through timely order fulfillment
- **System performance**: <2s response time, 99.5% uptime

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow existing code style and conventions
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/urban-farming-management-system/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/urban-farming-management-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/urban-farming-management-system/discussions)

## 🌍 Impact

This system aims to support Rwanda's urban agriculture sector by:
- Promoting sustainable farming practices
- Improving food security in urban areas
- Creating efficient supply chains
- Supporting local farmers and communities

## 🏆 Acknowledgments

- Rwanda Ministry of Agriculture
- Urban farming communities in Rwanda
- Open source contributors
- Technology partners

---

**Built with ❤️ for sustainable urban agriculture in Rwanda**
