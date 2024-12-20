# Movies Ocean

**Movies Ocean** is a cloud-based web application that allows users to stream movies over the internet. The system is designed with scalability, security, and high availability in mind using AWS services.

## Features

- **User Authentication**:
  - Handled using **AWS Cognito** for secure user registration and login.
  - Supports multi-factor authentication (MFA) and role-based access.

- **Media Streaming**:
  - Videos and images are stored in **Amazon S3** for scalable and cost-effective storage.
  - Supports high availability and durability for media content.

- **Admin Panel**:
  - Role-based functionality for administrators to upload new media content.
  - APIs manage user roles and media URLs.

- **Secure API**:
  - APIs are hosted on **AWS API Gateway** with authorization validation to ensure secure access.
  - Backend logic is implemented using **AWS Lambda**.

- **Scalable Deployment**:
  - The application is deployed using **AWS EC2** for complete control over resources.
  - High availability is ensured with multi-AZ deployment.

- **Backup and Recovery**:
  - Automated daily backups of critical data using **AWS Backup**.
  - Point-in-time recovery to ensure business continuity.

---

## Architecture Overview

The architecture follows a **public cloud deployment model** and is delivered as a **Software as a Service (SaaS)**. Below is the high-level overview:

### Components Used
1. **Frontend**:
   - Built with **React** for a seamless user experience.

2. **Backend**:
   - **AWS Lambda** for serverless backend logic.
   - **AWS API Gateway** for managing API requests.

3. **Storage**:
   - **Amazon S3** for media file storage.
   - **AWS RDS (Relational Database Service)** for managing user and media metadata.

4. **Security**:
   - **AWS Cognito** for authentication and role-based authorization.
   - **HTTPS/TLS** for secure data transfer.
   - **Environment variables** to secure sensitive information in **Lambda functions**.

5. **Network**:
   - **Amazon API Gateway** to route API requests.
   - **Amazon CloudFront** for fast content delivery and caching.

6. **Backup and Recovery**:
   - **AWS Backup** for automated backup and recovery solutions.

---

## Cost Analysis

### Monthly Operating Costs (Example)
| Service           | Cost Estimate          |
|--------------------|------------------------|
| **Amazon S3**     | $20.50 (500 GB storage + 100 GB data transfer) |
| **AWS RDS**       | $14.24 (t3.micro + 20 GB storage) |
| **AWS Lambda**    | $1.02 (100k requests + execution time) |
| **API Gateway**   | $17.50 (100k requests) |
| **CloudFront**    | $46.25 (500 GB data transfer + 50k requests) |
| **AWS Backup**    | $25.00 (500 GB backup storage) |
| **Cognito Users** | Free (under 50,000 MAUs) |
| **Total**         | ~$125.53               |

---

## Deployment Instructions

### Prerequisites
1. AWS Account with necessary permissions.
2. React development environment set up locally.

### Steps to Deploy
1. **Frontend**:
   - Clone the repository:
     ```bash
     git clone https://github.com/your-repo/movies-ocean.git
     cd movies-ocean/frontend
     npm install
     npm run build
     ```
   - Deploy the React app to **Amazon S3** or an **EC2 instance**.

2. **Backend**:
   - Deploy **Lambda functions** for backend logic using the AWS Management Console or **AWS SAM CLI**.
   - Configure **API Gateway** to route traffic to Lambda functions.

3. **Database**:
   - Set up an **AWS RDS instance** with appropriate schema for user and media data.

4. **Backup**:
   - Enable **AWS Backup** for automated daily backups.

5. **Testing**:
   - Access the application through the **CloudFront distribution URL**.
   - Test authentication, media upload, and streaming functionality.

---

## Security Features

- **HTTPS/TLS** for secure communication.
- **AWS Cognito** for managing users and roles securely.
- **S3 Server-Side Encryption** for securing media files.
- Environment variables to protect sensitive data in **Lambda functions**.

---

## Improvements and Optimization

- **Caching**:
  - Use **Amazon ElastiCache (Redis)** to reduce API calls for frequently accessed data.

- **Cost Optimization**:
  - Explore **reserved instances** for RDS to save up to 50%.
  - Leverage **AWS Free Tier** during the development phase.

- **Performance**:
  - Optimize Lambda memory and execution time.
  - Use **CloudFront caching** for faster media delivery.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing

Contributions are welcome! Feel free to raise issues or submit pull requests.

---

## Contact

For any queries or support, feel free to reach out to:

**Kavankumar Brahmbhatt**  
[Email](mailto:kavanbrahmbhatt0910@gmail.com) | [GitHub](https://github.com/KavanBrahmbhatt0910)
