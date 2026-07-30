'use strict';

const RelatedTools = (() => {

  
  const TOOL_INFO = {
    
    'merge-pdf':               { name:'Merge PDF',                  icon:'🔀', cat:'PDF Tools',   desc:'Combine multiple PDFs into one.' },
    'compress-pdf':            { name:'Compress PDF',               icon:'🗜️', cat:'PDF Tools',   desc:'Reduce PDF file size for uploads.' },
    'split-pdf':               { name:'Split PDF',                  icon:'✂️', cat:'PDF Tools',   desc:'Split a PDF into multiple parts.' },
    'rotate-pdf':              { name:'Rotate PDF',                 icon:'🔄', cat:'PDF Tools',   desc:'Rotate PDF pages 90°, 180°, 270°.' },
    'reorder-pdf':             { name:'Reorder PDF Pages',          icon:'🔁', cat:'PDF Tools',   desc:'Drag and drop to rearrange pages.' },
    'delete-pdf-pages':        { name:'Delete PDF Pages',           icon:'🗑️', cat:'PDF Tools',   desc:'Remove unwanted pages from a PDF.' },
    'extract-pdf-pages':       { name:'Extract PDF Pages',          icon:'📤', cat:'PDF Tools',   desc:'Save specific pages as a new PDF.' },
    'pdf-to-image':            { name:'PDF to Image',               icon:'🖼️', cat:'PDF Tools',   desc:'Convert PDF pages to JPG/PNG.' },
    'image-to-pdf':            { name:'Image to PDF',               icon:'📷', cat:'PDF Tools',   desc:'Convert images into a PDF document.' },
    'pdf-to-word':             { name:'PDF to Word',                icon:'📘', cat:'PDF Tools',   desc:'Convert PDF to editable Word file.' },
    'word-to-pdf':             { name:'Word to PDF',                icon:'📑', cat:'PDF Tools',   desc:'Convert Word documents to PDF.' },
    'pdf-to-text':             { name:'PDF to Text',                icon:'🔤', cat:'PDF Tools',   desc:'Extract plain text from a PDF.' },
    'text-to-pdf':             { name:'Text to PDF',                icon:'✍️', cat:'PDF Tools',   desc:'Convert plain text into a PDF.' },
    'pdf-page-counter':        { name:'PDF Page Counter',           icon:'🔢', cat:'PDF Tools',   desc:'Count total pages in a PDF.' },
    'pdf-password-protect':    { name:'PDF Password Protect',       icon:'🔒', cat:'PDF Tools',   desc:'Encrypt a PDF with a password.' },
    'pdf-password-remove':     { name:'PDF Password Remove',        icon:'🔓', cat:'PDF Tools',   desc:'Remove password from a PDF.' },
    'pdf-watermark-adder':     { name:'PDF Watermark Adder',        icon:'©️', cat:'PDF Tools',   desc:'Add text watermarks to PDF pages.' },
    'pdf-page-number-adder':   { name:'PDF Page Number Adder',      icon:'🔢', cat:'PDF Tools',   desc:'Add page numbers to your PDF.' },
    'pdf-metadata-viewer':     { name:'PDF Metadata Viewer',        icon:'ℹ️', cat:'PDF Tools',   desc:'View hidden PDF properties.' },
    'pdf-page-cropper':        { name:'PDF Page Cropper',           icon:'📐', cat:'PDF Tools',   desc:'Crop margins from PDF pages.' },
    'pdf-grayscale-converter': { name:'PDF Grayscale Converter',    icon:'⚫', cat:'PDF Tools',   desc:'Convert PDF pages to grayscale.' },
    'pdf-header-footer-adder': { name:'PDF Header & Footer Adder',  icon:'🔝', cat:'PDF Tools',   desc:'Add headers and footers to a PDF.' },
    'pdf-qr-code-inserter':    { name:'PDF QR Code Inserter',       icon:'📱', cat:'PDF Tools',   desc:'Embed a QR code into a PDF page.' },
    'pdf-file-size-analyzer':  { name:'PDF File Size Analyzer',     icon:'📊', cat:'PDF Tools',   desc:'Analyze what\'s bloating your PDF.' },
    'pdf-unlock-checker':      { name:'PDF Unlock Checker',         icon:'🔓', cat:'PDF Tools',   desc:'Check if a PDF is locked.' },
    'pdf-preview-generator':   { name:'PDF Preview Generator',      icon:'👁️', cat:'PDF Tools',   desc:'Generate preview images of PDF.' },
    'screenshot-to-pdf':       { name:'Screenshot to PDF',          icon:'📸', cat:'Image Tools', desc:'Convert screenshots to PDF instantly.' },

    
    'image-compressor':        { name:'Image Compressor',           icon:'🗜️', cat:'Image Tools', desc:'Reduce image file size with quality control.' },
    'image-resizer':           { name:'Image Resizer',              icon:'📐', cat:'Image Tools', desc:'Resize images to custom dimensions.' },
    'crop-image':              { name:'Crop Image',                 icon:'✂️', cat:'Image Tools', desc:'Crop unwanted parts of an image.' },
    'convert-image-format':    { name:'Convert Image Format',       icon:'🔄', cat:'Image Tools', desc:'Convert between PNG, JPG, WEBP.' },
    'image-to-base64':         { name:'Image to Base64',            icon:'📝', cat:'Image Tools', desc:'Encode images to Base64 string.' },
    'base64-to-image':         { name:'Base64 to Image',            icon:'🖼️', cat:'Image Tools', desc:'Decode Base64 string to image.' },
    'image-rotator':           { name:'Image Rotator',              icon:'🔁', cat:'Image Tools', desc:'Rotate images to any angle.' },
    'image-metadata-viewer':   { name:'Image Metadata Viewer',      icon:'ℹ️', cat:'Image Tools', desc:'View EXIF data in your images.' },
    'bulk-image-converter':    { name:'Bulk Image Converter',       icon:'📚', cat:'Image Tools', desc:'Convert multiple images at once.' },
    'png-to-jpg':              { name:'PNG to JPG',                 icon:'🔄', cat:'Image Tools', desc:'Convert PNG images to JPG.' },
    'jpg-to-png':              { name:'JPG to PNG',                 icon:'🖼️', cat:'Image Tools', desc:'Convert JPG images to PNG.' },
    'webp-to-jpg':             { name:'WEBP to JPG',                icon:'📷', cat:'Image Tools', desc:'Convert WEBP images to JPG.' },
    'jpg-to-webp':             { name:'JPG to WEBP',                icon:'🌐', cat:'Image Tools', desc:'Convert JPG images to WEBP.' },
    'heic-to-jpg':             { name:'HEIC to JPG',                icon:'🍏', cat:'Image Tools', desc:'Convert iPhone HEIC photos to JPG.' },
    'remove-image-metadata':   { name:'Remove Image Metadata',      icon:'🧹', cat:'Image Tools', desc:'Strip EXIF data from images.' },
    'image-watermark-tool':    { name:'Image Watermark Tool',       icon:'🎨', cat:'Image Tools', desc:'Add text or image watermark.' },
    'social-media-image-resizer':{ name:'Social Media Resizer',     icon:'📱', cat:'Image Tools', desc:'Resize images for Instagram, Twitter, etc.' },

    
    'attendance-calculator':   { name:'Attendance Calculator',      icon:'📊', cat:'Calculators', desc:'Calculate your attendance percentage.' },
    'cgpa-calculator':         { name:'CGPA Calculator',            icon:'🎓', cat:'Calculators', desc:'Compute your CGPA from grades.' },
    'percentage-calculator':   { name:'Percentage Calculator',      icon:'💯', cat:'Calculators', desc:'Calculate percentages instantly.' },
    'sgpa-calculator':         { name:'SGPA Calculator',            icon:'📈', cat:'Calculators', desc:'Calculate your semester GPA.' },
    'marks-needed':            { name:'Marks Needed Calculator',    icon:'🎯', cat:'Calculators', desc:'Find marks needed to pass.' },
    'grade-calculator':        { name:'Grade Calculator',           icon:'🅰️', cat:'Calculators', desc:'Convert marks to letter grades.' },
    'backlog-tracker':         { name:'Backlog Tracker',            icon:'📋', cat:'Calculators', desc:'Track and manage your backlogs.' },
    'study-hours':             { name:'Study Hours Planner',        icon:'⏱️', cat:'Calculators', desc:'Plan your study hours per subject.' },

    
    'timetable-planner':       { name:'Timetable Planner',          icon:'📅', cat:'Planners',    desc:'Create a weekly study timetable.' },
    'exam-countdown':          { name:'Exam Countdown',             icon:'⏳', cat:'Planners',    desc:'Count down to your exam dates.' },
    'assignment-tracker':      { name:'Assignment Tracker',         icon:'✅', cat:'Planners',    desc:'Track assignment deadlines.' },

    
    'resume-builder':          { name:'Resume Builder',             icon:'📄', cat:'Generators',  desc:'Build an ATS-friendly student resume.' },
    'cover-letter':            { name:'Cover Letter Generator',     icon:'✉️', cat:'Generators',  desc:'Generate professional cover letters.' },
  };

  
  const RELATED_MAP = {
    
    'merge-pdf':               ['compress-pdf',          'split-pdf',            'rotate-pdf',              'pdf-to-word'],
    'compress-pdf':            ['merge-pdf',             'pdf-to-image',         'pdf-to-word',             'split-pdf'],
    'split-pdf':               ['merge-pdf',             'extract-pdf-pages',    'delete-pdf-pages',        'compress-pdf'],
    'rotate-pdf':              ['merge-pdf',             'reorder-pdf',          'compress-pdf',            'split-pdf'],
    'reorder-pdf':             ['merge-pdf',             'split-pdf',            'delete-pdf-pages',        'compress-pdf'],
    'delete-pdf-pages':        ['extract-pdf-pages',     'split-pdf',            'merge-pdf',               'compress-pdf'],
    'extract-pdf-pages':       ['delete-pdf-pages',      'split-pdf',            'merge-pdf',               'compress-pdf'],
    'pdf-to-image':            ['image-compressor',      'image-resizer',        'compress-pdf',            'merge-pdf'],
    'image-to-pdf':            ['merge-pdf',             'compress-pdf',         'pdf-to-image',            'image-compressor'],
    'pdf-to-word':             ['compress-pdf',          'merge-pdf',            'pdf-to-text',             'split-pdf'],
    'word-to-pdf':             ['merge-pdf',             'compress-pdf',         'pdf-page-number-adder',   'pdf-watermark-adder'],
    'pdf-to-text':             ['pdf-to-word',           'merge-pdf',            'pdf-metadata-viewer',     'compress-pdf'],
    'text-to-pdf':             ['merge-pdf',             'compress-pdf',         'pdf-page-number-adder',   'word-to-pdf'],
    'pdf-page-counter':        ['pdf-metadata-viewer',   'compress-pdf',         'merge-pdf',               'split-pdf'],
    'pdf-password-protect':    ['pdf-password-remove',   'merge-pdf',            'compress-pdf',            'pdf-watermark-adder'],
    'pdf-password-remove':     ['pdf-password-protect',  'merge-pdf',            'compress-pdf',            'pdf-unlock-checker'],
    'pdf-watermark-adder':     ['pdf-page-number-adder', 'merge-pdf',            'compress-pdf',            'pdf-password-protect'],
    'pdf-page-number-adder':   ['pdf-watermark-adder',   'merge-pdf',            'compress-pdf',            'pdf-page-counter'],
    'pdf-metadata-viewer':     ['pdf-page-counter',      'compress-pdf',         'pdf-file-size-analyzer',  'pdf-unlock-checker'],
    'pdf-page-cropper':        ['crop-image',            'image-resizer',        'compress-pdf',            'merge-pdf'],
    'pdf-grayscale-converter': ['compress-pdf',          'merge-pdf',            'pdf-to-image',            'image-compressor'],
    'pdf-header-footer-adder': ['pdf-page-number-adder', 'pdf-watermark-adder',  'merge-pdf',               'compress-pdf'],
    'pdf-qr-code-inserter':    ['pdf-watermark-adder',   'pdf-page-number-adder','merge-pdf',               'compress-pdf'],
    'pdf-file-size-analyzer':  ['compress-pdf',          'pdf-metadata-viewer',  'merge-pdf',               'split-pdf'],
    'pdf-unlock-checker':      ['pdf-password-remove',   'pdf-password-protect', 'pdf-metadata-viewer',     'compress-pdf'],
    'pdf-preview-generator':   ['pdf-to-image',          'compress-pdf',         'merge-pdf',               'pdf-page-counter'],
    'screenshot-to-pdf':       ['image-to-pdf',          'merge-pdf',            'compress-pdf',            'image-compressor'],

    
    'image-compressor':        ['image-resizer',         'convert-image-format', 'crop-image',              'image-to-pdf'],
    'image-resizer':           ['image-compressor',      'crop-image',           'convert-image-format',    'image-to-pdf'],
    'crop-image':              ['image-resizer',         'image-compressor',     'screenshot-to-pdf',       'image-to-pdf'],
    'convert-image-format':    ['image-compressor',      'image-resizer',        'png-to-jpg',              'image-to-pdf'],
    'image-to-base64':         ['base64-to-image',       'image-compressor',     'image-resizer',           'convert-image-format'],
    'base64-to-image':         ['image-to-base64',       'image-compressor',     'image-to-pdf',            'convert-image-format'],
    'image-rotator':           ['crop-image',            'image-resizer',        'image-compressor',        'image-to-pdf'],
    'image-metadata-viewer':   ['remove-image-metadata', 'image-compressor',     'image-resizer',           'crop-image'],
    'bulk-image-converter':    ['convert-image-format',  'image-compressor',     'image-resizer',           'image-to-pdf'],
    'png-to-jpg':              ['jpg-to-png',            'image-compressor',     'convert-image-format',    'image-to-pdf'],
    'jpg-to-png':              ['png-to-jpg',            'image-compressor',     'convert-image-format',    'image-to-pdf'],
    'webp-to-jpg':             ['jpg-to-webp',           'png-to-jpg',           'image-compressor',        'convert-image-format'],
    'jpg-to-webp':             ['webp-to-jpg',           'png-to-jpg',           'image-compressor',        'convert-image-format'],
    'heic-to-jpg':             ['png-to-jpg',            'image-compressor',     'convert-image-format',    'image-to-pdf'],
    'remove-image-metadata':   ['image-metadata-viewer', 'image-compressor',     'crop-image',              'image-resizer'],
    'image-watermark-tool':    ['pdf-watermark-adder',   'image-compressor',     'image-resizer',           'crop-image'],
    'social-media-image-resizer':['image-resizer',       'crop-image',           'image-compressor',        'image-watermark-tool'],

    
    'attendance-calculator':   ['cgpa-calculator',       'sgpa-calculator',      'marks-needed',            'grade-calculator'],
    'cgpa-calculator':         ['attendance-calculator', 'sgpa-calculator',      'grade-calculator',        'resume-builder'],
    'percentage-calculator':   ['marks-needed',          'grade-calculator',     'cgpa-calculator',         'attendance-calculator'],
    'sgpa-calculator':         ['cgpa-calculator',       'attendance-calculator','grade-calculator',        'marks-needed'],
    'marks-needed':            ['percentage-calculator', 'grade-calculator',     'attendance-calculator',   'cgpa-calculator'],
    'grade-calculator':        ['marks-needed',          'percentage-calculator','cgpa-calculator',         'attendance-calculator'],
    'backlog-tracker':         ['attendance-calculator', 'cgpa-calculator',      'timetable-planner',       'study-hours'],
    'study-hours':             ['timetable-planner',     'attendance-calculator','exam-countdown',          'assignment-tracker'],

    
    'timetable-planner':       ['exam-countdown',        'study-hours',          'assignment-tracker',      'attendance-calculator'],
    'exam-countdown':          ['timetable-planner',     'study-hours',          'attendance-calculator',   'marks-needed'],
    'assignment-tracker':      ['timetable-planner',     'study-hours',          'exam-countdown',          'backlog-tracker'],

    
    'resume-builder':          ['cover-letter',          'cgpa-calculator',      'compress-pdf',            'image-to-pdf'],
    'cover-letter':            ['resume-builder',        'cgpa-calculator',      'compress-pdf',            'word-to-pdf'],
  };

  
  const DEFAULT_RELATED = ['merge-pdf', 'compress-pdf', 'image-to-pdf', 'attendance-calculator'];

  
  function get(toolId, limit = 4) {
    const ids = (RELATED_MAP[toolId] || DEFAULT_RELATED).slice(0, limit);
    return ids
      .map(id => {
        const info = TOOL_INFO[id];
        if (!info) return null;
        return {
          id,
          name: info.name,
          icon: info.icon,
          cat:  info.cat,
          desc: info.desc,
          link: `../tools/${id}.html`,
        };
      })
      .filter(Boolean);
  }

  
  function info(toolId) {
    return TOOL_INFO[toolId] || null;
  }

  return { get, info, TOOL_INFO, RELATED_MAP };
})();

window.RelatedTools = RelatedTools;