import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Send, Mail } from "lucide-react";
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="contact-section">
      {/* ===== SECTION HEADING ===== */}
      <div className="contact-container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="contact-heading"
        >
          Contact Me
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="contact-subheading"
        >
          Let's build something impactful together. Whether you have a project,
          an opportunity, or just want to connect — my inbox is always open.
        </motion.p>
      </div>

      {/* ===== CONTACT CARD ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="contact-card-wrapper"
      >
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="form-input"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="form-input"
              required
            />
          </div>

          {/* MESSAGE */}
          <div className="form-group">
            <label className="form-label">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell me about your idea, project, or opportunity..."
              className="form-textarea"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="submit-button"
          >
            Send Message <Send size={18} />
          </motion.button>
        </form>

        {/* ===== SOCIAL LINKS ===== */}
        <div className="social-section">
          <p className="social-text">You can also find me on:</p>
          <div className="social-links">
            {/* GITHUB */}
            <a
              href="https://github.com/Chira278"
              target="_blank"
              rel="noreferrer"
              className="social-link github"
            >
              <Github size={18} />
              GitHub
            </a>

            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/chirag-vijan-971918cc/"
              target="_blank"
              rel="noreferrer"
              className="social-link linkedin"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>

            {/* GMAIL */}
            <a
              href="mailto:chiragvijan278@gmail.com"
              className="social-link email"
            >
              <Mail size={18} />
              chiragvijan278@gmail.com
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
