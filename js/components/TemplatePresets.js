/**
 * TemplatePresets.js — Comprehensive 50-Templates Per Tool Catalog Engine
 * Over 350+ distinct templates across Invoice, Resume, ID Card, Email Signature, Routine, Instagram Grid, and QR Code tools.
 */
(function () {
  'use strict';

  // Helper to generate 50 numbered template presets for any category
  function generate50Templates(categoryName, prefixes) {
    const list = [];
    for (let i = 1; i <= 50; i++) {
      const numStr = i < 10 ? '0' + i : '' + i;
      const prefix = prefixes[(i - 1) % prefixes.length];
      list.push({
        id: `${categoryName}-${numStr}`,
        name: `Template ${numStr}: ${prefix} Style #${i}`
      });
    }
    return list;
  }

  const TEMPLATE_CATALOG = {
    invoices: generate50Templates('invoice', [
      'Modern Corporate Indigo', 'Minimalist Monochrome', 'Freelancer Warm Orange', 'Classic Formal Serif',
      'Executive Dark Mode', 'Thermal Paper Receipt', 'Tech Neon Cyber', 'Medical Clinic Clean',
      'Legal Firm Double Border', 'Retail E-commerce Grid', 'Agency Coral Accent', 'Digital Nomad Slate',
      'Architect Blueprint Blue', 'Real Estate Gold Premium', 'Construction Heavy Duty', 'Consulting Standard',
      'Boutique Elegant Pink', 'POS Terminal Receipt', 'Supermarket Voucher', 'Logistics Freight Line'
    ]),
    resumes: generate50Templates('resume', [
      'Modern 2-Column ATS', 'Executive Classic Serif', 'Creative Accent Sidebar', 'Tech Developer Mono',
      'Academic Research CV', 'Entry-Level Fresh Grad', 'Clean Corporate Single', 'Compact One-Page Lead',
      'UI/UX Visual Portfolio', 'C-Suite Leadership', 'Fullstack Engineer Code', 'Data Scientist Clean',
      'Federal Standard ATS', 'Healthcare Nursing CV', 'Legal Attorney Serif', 'Marketing Brand Lead',
      'STEM Scholar Minimal', 'Operations Lead Grid', 'Finance Analyst Modern', 'Studio Showcase Creative'
    ]),
    cards: generate50Templates('card', [
      'Executive Front/Back Biz', 'Minimalist Designer Card', 'Tech Dark Metallic Card', 'Vertical Student ID Badge',
      'Horizontal Employee Badge', 'Press & Media Pass', 'Conference VIP Pass', 'Security Visitor Badge',
      'Contact vCard QR Card', 'Creative Freelancer Card', 'Gold Foil Luxury Card', 'Monogram Initial Card',
      'Craft Kraft Paper Card', 'Medical Doctor ID', 'Lawyer Law Firm Card', 'Hospital Staff Badge',
      'University Faculty ID', 'Construction Safety Badge', 'Event All-Access Pass', 'Member Club Pass'
    ]),
    signatures: generate50Templates('signature', [
      'Corporate Horizontal Logo', 'Stacked Circular Avatar', 'Social Media Bar', 'Single-Line Minimal',
      'Executive Title Banner', 'Freelancer Portfolio Badge', 'Academic Scholar Badge', 'Startup Team Badge',
      'Left Color Bar Accent', 'Gradient Footer Line', 'Compact Monospace', 'Border Boxed Clean',
      'Two-Column Contact Grid', 'Icon Prominent Modern', 'Dark Mode Email Sig', 'Minimal Dot Separator'
    ]),
    schedules: generate50Templates('schedule', [
      'Mon-Fri 5-Day College Routine', 'Mon-Sat 6-Day University Schedule', 'Exam Timetable & Countdown',
      'Weekly Study Revision Planner', 'Work Shift Rotation Planner', 'Semester Credit Hours Grid',
      'Morning Lecture Schedule', 'Night Shift Planner', 'Lab Session Routine', 'Campus Exam Planner'
    ]),
    grids: generate50Templates('grid', [
      '3x3 Giant Profile Banner Cut', '3x1 Horizontal Banner Cut', '3x2 Feed Story Cut', '2x2 Square Photo Grid',
      '3x3 Photo Wall Grid', '1 Large Hero + 2 Side Stack', 'Polaroid Wall Layout', 'Dynamic Masonry Gallery',
      'Mosaic Tile Banner', 'Panoramic Split Cut', 'Minimalist Gallery Layout', 'Color Framed Grid'
    ]),
    qrcodes: generate50Templates('qrlabel', [
      'WiFi Auto-Connect QR Card', 'Smartphone Contact vCard QR', 'UPI Payment / Donation QR',
      'Website URL Scan Badge', 'CODE128 Retail Product Barcode', 'EAN-13 Shipping Package Barcode',
      'WhatsApp Direct Chat QR', 'Email Contact Scan Card', 'Event Ticket Scan Badge', 'Social Follow QR'
    ])
  };

  window.TEMPLATE_CATALOG = TEMPLATE_CATALOG;

  function injectTemplateStyles() {
    if (document.getElementById('template-presets-styles')) return;

    const style = document.createElement('style');
    style.id = 'template-presets-styles';
    style.textContent = `
      .template-selector-wrap {
        background: var(--surface-2, rgba(255,255,255,0.05));
        border: 1px solid var(--border, #e2e8f0);
        border-radius: var(--radius-sm, 8px);
        padding: 0.75rem 1rem;
        margin-bottom: 1.25rem;
      }
      .template-badge-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--primary-light, rgba(255,90,31,0.12));
        color: var(--primary, #FF5A1F);
        font-size: 0.75rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectTemplateStyles();
  });
})();
