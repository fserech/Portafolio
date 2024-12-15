<<<<<<< HEAD
<<<<<<< HEAD
# Portafolio
=======
# Ngdevfolio
=======
# NgDevFolio - Modern Angular Portfolio Website
>>>>>>> 408ad50 (portfolio readme added)

> This is an Angular adaptation of the excellent [Developer Portfolio](https://github.com/said7388/developer-portfolio) project originally created by [Abu Said](https://github.com/said7388) in Next.js.

<p align="center">
  <img src="src/assets/images/logo.png" alt="NgDevFolio Logo" width="200"/>
</p>

A modern, responsive, and customizable portfolio website built with Angular 19. Perfect for developers looking to showcase their work, skills, and professional journey.

## 🌟 Features

- 📱 Fully Responsive Design
- 🎨 Modern UI with Tailwind CSS
- 📝 Dynamic Blog Integration with Dev.to API
- 📧 Contact Form with EmailJS
- 🚀 Optimized Performance
- 🔍 SEO Friendly
- 🌓 Dark Mode Support
- 📊 Analytics Ready

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.io/cli) (v19 or higher)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ngdevfolio.git
   cd ngdevfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Copy contents from `.env.template`
   - Fill in your values:
   ```env
   EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   ```

4. **Start development server**
   ```bash
   ng serve
   ```

5. **View your portfolio**
   Open [http://localhost:4200](http://localhost:4200) in your browser

## 📝 Configuration

### Personal Information
Edit `src/app/core/data/personal-info.ts`:
```typescript
export const personalInfo = {
  name: 'Your Name',
  title: 'Your Title',
  email: 'your.email@example.com',
  // ... other personal details
};
```

### Projects
Edit `src/app/core/data/projects.ts`:
```typescript
export const projects = [
  {
    title: 'Project Name',
    description: 'Project Description',
    technologies: ['Angular', 'TypeScript', 'Tailwind'],
    github: 'https://github.com/...',
    demo: 'https://demo-link...'
  },
  // ... more projects
];
```

### Blog Integration
1. Get your Dev.to username
2. Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     // ... other config
     devTo: {
       username: 'your-devto-username'
     }
   };
   ```

### Email Configuration
1. Create an [EmailJS](https://www.emailjs.com/) account
2. Create an email template
3. Get your credentials
4. Add them to your `.env` file

## 🎨 Customization

### Styling
- Main styles: `src/styles.css`
- Tailwind config: `tailwind.config.js`
- Component-specific styles: `src/app/components/*/*.css`

### Content
- Components: `src/app/components/`
- Data: `src/app/core/data/`
- Assets: `src/assets/`

## 📦 Building for Production

1. **Build the project**
   ```bash
   ng build --configuration production
   ```

2. **Test the production build locally**
   ```bash
   npm install -g http-server
   http-server dist/ngdevfolio
   ```

## 🚀 Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify
1. Push to GitHub
2. Connect repository in Netlify
3. Configure build settings:
   - Build command: `ng build --configuration production`
   - Publish directory: `dist/ngdevfolio`

## 🔧 Troubleshooting

### Common Issues

1. **EmailJS not working**
   - Check if environment variables are properly set
   - Verify EmailJS template configuration

<<<<<<< HEAD
For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
>>>>>>> 9579e2c (first commit)
=======
2. **Blog posts not loading**
   - Confirm Dev.to username is correct
   - Check network requests for API errors

3. **Styling issues**
   - Run `npm run build:css` to rebuild Tailwind
   - Clear browser cache

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Dev.to API Documentation](https://developers.forem.com/api)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Portfolio Design by [Abu Said](https://github.com/said7388/developer-portfolio) built with Next.js
- Angular Team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- EmailJS for the email service
- Dev.to for the blog integration capabilities

---

Made with ❤️ by Javeed Ishaq
>>>>>>> 408ad50 (portfolio readme added)
