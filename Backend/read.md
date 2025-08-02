# Frontend Development Instructions for Medical Image Classification System

## Project Overview

Create a modern, responsive web application that allows medical professionals to upload images and receive AI-powered disease classifications. The application should connect to our existing backend API which uses a MedCLIP model to classify medical images against known diseases.

## Key Features

1. **Authentication**
   - Login screen for doctors and nurses
   - JWT token management (storage and refresh)
   - Role-based access control

2. **Image Upload Interface**
   - Drag-and-drop file upload area
   - Image preview before submission
   - Upload progress indicator
   - File type validation (images only)

3. **Classification Results View**
   - Display top 5 disease matches with:
     - Disease name
     - Confidence score (0-1 scale) with visual indicator
     - Best matching phrase from disease description
   - Option to view more/fewer results (3-10)
   - Option to retry with different image

4. **History/Dashboard**
   - List of previously classified images
   - Filter and search capabilities
   - Option to revisit previous classification results

## Technical Requirements

### API Integration

Connect to the following endpoint:
```
POST /api/v1/classification/classify
```

**Request:**
- Content-Type: `multipart/form-data`
- Authorization: `Bearer <JWT_TOKEN>`
- Parameters:
  - `file`: The image file (required)
  - `max_phrases`: Integer, default 12 (optional)
  - `top_k`: Integer, default 5 (optional)

**Response Format:**
```json
{
  "results": [
    {
      "disease_name": "Disease Name",
      "score": 0.95,
      "best_phrase": "Specific phrase from disease description that matched"
    },
    ...
  ]
}
```

**Error Handling:**
- 400: Invalid file type (not an image)
- 401: Unauthorized (invalid token)
- 403: Forbidden (insufficient permissions)
- 500: Server error during classification

### UI/UX Guidelines

1. **Design System**
   - Use a clean, medical-themed design
   - Follow accessibility guidelines (WCAG 2.1)
   - Responsive layout for desktop and tablet use

2. **Visualization**
   - Use horizontal bar charts to show confidence scores
   - Color-code results based on score ranges:
     - High confidence (0.8-1.0): Green
     - Medium confidence (0.5-0.79): Yellow
     - Low confidence (<0.5): Gray

3. **User Flow**
   - Simple, guided process from upload to results
   - Minimize clicks required to perform classification
   - Clear error messages and recovery options

## Development Stack Recommendations

- React or Vue.js for frontend framework
- TypeScript for type safety
- Material UI, Ant Design, or custom components
- Axios for API requests
- React Query or similar for data fetching and caching
- JWT handling library (e.g., auth0-spa-js)
- Formik or React Hook Form for form management
- Vitest or Jest for testing

## Deployment Considerations

- Build for modern browsers
- Setup proper CORS configuration to work with our API
- Implement appropriate caching strategies
- Consider progressive web app capabilities for offline access

## Example User Scenarios

1. **Doctor Classification Workflow**
   - Doctor logs in with credentials
   - Uploads an MRI scan image
   - Reviews top 5 disease matches
   - Checks confidence scores and supporting phrases
   - Makes clinical assessment based on AI suggestions

2. **Nurse Reference Workflow**
   - Nurse logs in with credentials
   - Accesses historical classifications
   - Reviews previous diagnoses and AI suggestions
   - Uses information to prepare patient documentation

## Security Requirements

- Secure storage of JWT tokens
- No sensitive data in local storage
- Automatic session timeout after period of inactivity
- Secure handling of uploaded images (no client-side storage)

## Deliverables

- Source code with documentation
- Build instructions
- User guide
- Component testing
- End-to-end testing for critical flows



