const fs = require('fs');
const path = require('path');

const SITE = 'https://www.umarshoaib.com';
const blogDir = path.join(__dirname, '..', 'blog');

const posts = [
	{
		slug: 'openai-api-laravel-integration',
		title: 'Integrating OpenAI API in Laravel Applications',
		description: 'Learn how to integrate OpenAI API in Laravel for content generation, chatbots, and automation with secure API keys and clean service architecture.',
		tag: 'Laravel · AI',
		date: '2026-06-18',
		dateDisplay: 'June 18, 2026',
		image: '../images/blog/blog1.jpg',
		featured: true,
		content: `
			<p>OpenAI API integration in Laravel is one of the most requested features in modern web applications. From auto-generating product descriptions to building intelligent chatbots, Laravel provides an excellent foundation for AI-powered backends.</p>
			<h2>Why Laravel for OpenAI Integration?</h2>
			<p>Laravel's service container, configuration system, and queue workers make it ideal for OpenAI API calls. You can encapsulate API logic in dedicated service classes, keep controllers thin, and process long-running AI tasks asynchronously.</p>
			<h2>Setting Up Secure API Keys</h2>
			<p>Never hardcode your OpenAI API key. Store it in your <code>.env</code> file and reference it through <code>config/services.php</code>. Use Laravel's HTTP client to make requests with proper error handling and rate limiting.</p>
			<h2>Building a Reusable AI Service</h2>
			<p>Create an <code>OpenAIService</code> class that handles prompt construction, response parsing, and token management. This approach follows SOLID principles and makes your AI features testable and maintainable.</p>
			<ul>
				<li>Use form requests for input validation before sending prompts</li>
				<li>Cache repeated queries to reduce API costs</li>
				<li>Log failures and implement retry logic with exponential backoff</li>
				<li>Queue heavy generation tasks using Laravel Horizon or database queues</li>
			</ul>
			<h2>Real-World Use Cases</h2>
			<p>In production, I've used OpenAI API with Laravel for vehicle description generation, paraphrasing tools, and content automation via n8n workflows. Each implementation prioritized security, cost control, and user experience.</p>
			<p>If you're building AI features into a Laravel app, start with a focused use case, measure token usage, and iterate based on real user feedback.</p>
		`
	},
	{
		slug: 'laravel-rest-api-best-practices',
		title: 'Laravel REST API Best Practices for Production',
		description: 'Production-ready Laravel REST API best practices covering authentication, validation, versioning, error handling, and scalable architecture patterns.',
		tag: 'Laravel · Backend',
		date: '2026-06-12',
		dateDisplay: 'June 12, 2026',
		image: '../images/blog/blog2.png',
		featured: true,
		content: `
			<p>Building REST APIs with Laravel is straightforward, but shipping production-grade APIs requires discipline around architecture, security, and performance.</p>
			<h2>API-First Design</h2>
			<p>Start with clear resource definitions and consistent naming conventions. Use plural nouns for endpoints, proper HTTP verbs, and meaningful status codes. Document your API with tools like Postman or OpenAPI/Swagger.</p>
			<h2>Authentication & Authorization</h2>
			<p>Use Laravel Sanctum or Passport for token-based authentication. Implement role-based access control (RBAC) with policies and gates rather than scattering permission checks across controllers.</p>
			<h2>Validation & Error Responses</h2>
			<p>Always validate input using Form Request classes. Return consistent JSON error structures so frontend clients can handle failures predictably.</p>
			<ul>
				<li>Use API resources/transformers for consistent response shapes</li>
				<li>Implement pagination for list endpoints</li>
				<li>Add rate limiting via Laravel's throttle middleware</li>
				<li>Version your API (<code>/api/v1/</code>) from day one</li>
			</ul>
			<h2>Performance Tips</h2>
			<p>Eager load relationships to avoid N+1 queries, index frequently filtered columns, and use Redis for caching hot endpoints. Monitor query performance in production with Laravel Telescope or external APM tools.</p>
		`
	},
	{
		slug: 'yolo-object-detection-guide',
		title: 'YOLO Object Detection: A Practical Guide for Developers',
		description: 'A practical YOLO object detection guide for developers covering model training, real-time inference, deployment on CPU/GPU, and computer vision project tips.',
		tag: 'AI · Computer Vision',
		date: '2026-06-05',
		dateDisplay: 'June 5, 2026',
		image: '../images/blog/blog3.png',
		featured: true,
		content: `
			<p>YOLO (You Only Look Once) is one of the most popular architectures for real-time object detection. Whether you're building security systems, quality control pipelines, or exam monitoring tools, YOLO delivers strong accuracy with fast inference.</p>
			<h2>How YOLO Works</h2>
			<p>Unlike traditional two-stage detectors, YOLO processes an entire image in a single forward pass, predicting bounding boxes and class probabilities simultaneously. This makes it ideal for real-time applications.</p>
			<h2>Training Your Model</h2>
			<p>Start with a pre-trained YOLO model and fine-tune on your custom dataset. Label data carefully, balance classes, and augment images to improve generalization. Tools like Roboflow and CVAT simplify dataset preparation.</p>
			<h2>Deployment Options</h2>
			<ul>
				<li><strong>GPU servers</strong> — best for high-throughput live video streams</li>
				<li><strong>CPU inference</strong> — viable for recorded video analysis</li>
				<li><strong>Edge devices</strong> — Raspberry Pi with optimized models for lightweight monitoring</li>
			</ul>
			<h2>Lessons from Production</h2>
			<p>In my exam cheating detection project, YOLO achieved approximately 94% accuracy detecting smartwatches, mobile phones, and other prohibited objects. Key success factors were quality training data, proper lighting normalization, and choosing the right model size for your hardware constraints.</p>
		`
	},
	{
		slug: 'mern-vs-laravel-backend-guide',
		title: 'MERN Stack vs Laravel: Choosing the Right Backend',
		description: 'Compare MERN stack vs Laravel for backend development. Learn when to choose Node.js/Express/MongoDB or Laravel/MySQL for your next web application.',
		tag: 'Full-Stack',
		date: '2026-05-28',
		dateDisplay: 'May 28, 2026',
		image: '../images/blog/blog1.jpg',
		featured: false,
		content: `
			<p>Choosing between MERN (MongoDB, Express, React, Node.js) and Laravel depends on your team, project requirements, and long-term maintenance goals.</p>
			<h2>When to Choose MERN</h2>
			<p>MERN excels when you want JavaScript across the entire stack, need flexible document-based schemas, or are building real-time applications with WebSockets. Startups and SPAs often benefit from shared language expertise between frontend and backend teams.</p>
			<h2>When to Choose Laravel</h2>
			<p>Laravel shines for structured business applications, complex relational data, and rapid backend development. Its built-in authentication, ORM (Eloquent), queues, and testing tools accelerate enterprise-grade API development.</p>
			<h2>Hybrid Approach</h2>
			<p>Many production systems use React frontends with Laravel APIs — combining Laravel's backend maturity with React's interactive UI capabilities. This is my preferred approach for client projects requiring both speed and maintainability.</p>
		`
	},
	{
		slug: 'deploy-flask-ml-api-production',
		title: 'Deploying Flask ML APIs to Production',
		description: 'Step-by-step guide to deploying Flask machine learning APIs to production with Gunicorn, Docker, environment config, and monitoring best practices.',
		tag: 'Python · ML',
		date: '2026-05-20',
		dateDisplay: 'May 20, 2026',
		image: '../images/blog/blog2.png',
		featured: false,
		content: `
			<p>Flask is lightweight and perfect for serving machine learning models as REST APIs. Moving from a Jupyter notebook to a production Flask service requires attention to performance, security, and reliability.</p>
			<h2>Production Server Setup</h2>
			<p>Never use Flask's built-in development server in production. Deploy with Gunicorn or uWSGI behind Nginx as a reverse proxy. Containerize with Docker for consistent environments across staging and production.</p>
			<h2>Model Loading Strategy</h2>
			<p>Load ML models once at application startup, not on every request. Use lazy loading for large models and consider model versioning so you can roll back without downtime.</p>
			<h2>API Design for ML</h2>
			<ul>
				<li>Validate input dimensions and data types strictly</li>
				<li>Return confidence scores alongside predictions</li>
				<li>Set request timeouts appropriate for inference time</li>
				<li>Monitor latency, error rates, and model drift</li>
			</ul>
		`
	},
	{
		slug: 'mysql-vs-postgresql-web-apps',
		title: 'MySQL vs PostgreSQL for Web Applications',
		description: 'MySQL vs PostgreSQL comparison for web developers. Learn which database to choose for Laravel, Node.js, and production web applications in 2026.',
		tag: 'Databases',
		date: '2026-05-14',
		dateDisplay: 'May 14, 2026',
		image: '../images/blog/blog3.png',
		featured: false,
		content: `
			<p>Both MySQL and PostgreSQL are excellent choices for web application backends. The right pick depends on your data model complexity, query patterns, and ecosystem preferences.</p>
			<h2>MySQL Strengths</h2>
			<p>MySQL is widely supported, fast for read-heavy workloads, and the default choice for many Laravel hosting providers. It's ideal for CRUD-heavy applications with straightforward relational schemas.</p>
			<h2>PostgreSQL Strengths</h2>
			<p>PostgreSQL offers advanced features like JSONB columns, full-text search, window functions, and stricter data integrity. It's the better choice for analytics-heavy apps and complex queries.</p>
			<h2>Practical Recommendation</h2>
			<p>For most Laravel SaaS products, either works well. Choose PostgreSQL when you need advanced querying or JSON document storage alongside relational data. Choose MySQL when simplicity and hosting compatibility matter most.</p>
		`
	},
	{
		slug: 'python-llm-chatbot-tutorial',
		title: 'Building AI Chatbots with Python and LLMs',
		description: 'Build AI chatbots with Python and LLMs using OpenAI API, website crawling, semantic search, and Flask deployment for backend integration.',
		tag: 'Python · AI',
		date: '2026-05-08',
		dateDisplay: 'May 8, 2026',
		image: '../images/blog/blog1.jpg',
		featured: false,
		content: `
			<p>LLM-powered chatbots have transformed how businesses interact with website visitors. Building one with Python gives you full control over data sources, response quality, and integration points.</p>
			<h2>Architecture Overview</h2>
			<p>A production chatbot typically includes: a web crawler or document loader, a text chunking and embedding pipeline, a vector store for semantic search, and an LLM for generating contextual responses.</p>
			<h2>Website-Crawling Chatbots</h2>
			<p>For site-specific chatbots, crawl and index your content, embed chunks using OpenAI embeddings, and retrieve relevant context before generating answers. This RAG (Retrieval-Augmented Generation) approach reduces hallucinations significantly.</p>
			<h2>Deployment with Flask</h2>
			<p>Wrap your chatbot logic in Flask endpoints that accept user queries and return JSON responses. This makes integration into Laravel, React, or mobile apps straightforward via standard HTTP calls.</p>
		`
	},
	{
		slug: 'laravel-role-based-access-control',
		title: 'Role-Based Access Control in Laravel Explained',
		description: 'Implement role-based access control in Laravel using policies, gates, middleware, and Spatie permissions for secure multi-role applications.',
		tag: 'Laravel · Security',
		date: '2026-04-30',
		dateDisplay: 'April 30, 2026',
		image: '../images/blog/blog2.png',
		featured: false,
		content: `
			<p>Role-based access control (RBAC) is essential for applications with multiple user types — admins, dealers, crew members, or customers. Laravel provides elegant tools to implement RBAC cleanly.</p>
			<h2>Core Concepts</h2>
			<p>Define roles (Admin, User, Manager) and permissions (create-post, delete-user) separately. Assign roles to users and check permissions at the route, controller, or view level.</p>
			<h2>Laravel Policies & Gates</h2>
			<p>Use policies for model-level authorization and gates for general abilities. This keeps authorization logic out of controllers and makes your codebase testable.</p>
			<h2>Middleware Protection</h2>
			<p>Apply role middleware to route groups to enforce access at the entry point. Combine with form request authorization for defense in depth.</p>
		`
	},
	{
		slug: 'n8n-automation-for-developers',
		title: 'n8n Workflow Automation for Developers',
		description: 'Use n8n workflow automation to connect APIs, automate data sync, integrate OpenAI, and reduce manual operations in Laravel and Node.js projects.',
		tag: 'DevOps · Automation',
		date: '2026-04-22',
		dateDisplay: 'April 22, 2026',
		image: '../images/blog/blog3.png',
		featured: false,
		content: `
			<p>n8n is a powerful open-source workflow automation tool that connects APIs, databases, and services without writing boilerplate integration code.</p>
			<h2>Why Developers Use n8n</h2>
			<p>Instead of building custom cron jobs for every integration, n8n provides a visual workflow builder. Trigger actions on schedules, webhooks, or database changes — then chain API calls, data transformations, and notifications.</p>
			<h2>Real Production Example</h2>
			<p>In a vehicle inventory system, n8n automated dealer data synchronization, reducing manual CSV uploads and ensuring pricing stayed current across platforms.</p>
			<h2>Best Practices</h2>
			<ul>
				<li>Keep workflows idempotent to handle retries safely</li>
				<li>Log workflow executions and set up failure alerts</li>
				<li>Store credentials securely in n8n's credential manager</li>
				<li>Start simple — automate one painful manual task first</li>
			</ul>
		`
	},
	{
		slug: 'freelance-full-stack-developer-tips',
		title: 'Freelance Full-Stack Developer: Lessons Learned',
		description: 'Practical freelance full-stack developer tips on client communication, scoping projects, pricing, delivery, and building long-term remote client relationships.',
		tag: 'Freelance · Career',
		date: '2026-04-15',
		dateDisplay: 'April 15, 2026',
		image: '../images/blog/blog1.jpg',
		featured: false,
		content: `
			<p>Freelancing as a full-stack developer taught me as much about communication and project management as it did about code. Here are lessons that improved my client relationships and delivery quality.</p>
			<h2>Scope Before Code</h2>
			<p>Every successful freelance project starts with a clear scope document. Define deliverables, tech stack, timeline, and what's explicitly out of scope. This prevents scope creep and sets realistic expectations.</p>
			<h2>Communicate in Milestones</h2>
			<p>Break projects into milestones with demo checkpoints. Clients stay confident when they see progress regularly, and you catch misalignment early before it becomes expensive.</p>
			<h2>Technical Choices</h2>
			<p>Choose boring, proven technology for client projects. Laravel and MERN aren't exciting — they're reliable. Your client pays for outcomes, not trendy frameworks.</p>
			<h2>Build for Handoff</h2>
			<p>Document APIs, write README files, and use clean Git history. Clients and future developers will thank you, and strong handoffs lead to repeat business and referrals.</p>
		`
	}
];

function postHtml(post) {
	const canonical = `${SITE}/blog/${post.slug}.html`;
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>${post.title} | Umar Shoaib Blog</title>
	<meta name="description" content="${post.description}" />
	<meta name="author" content="Umar Shoaib" />
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="${canonical}" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="${canonical}" />
	<meta property="og:title" content="${post.title}" />
	<meta property="og:description" content="${post.description}" />
	<meta property="og:image" content="${SITE}/images/umar.jpeg" />
	<meta property="article:published_time" content="${post.date}" />
	<meta property="article:author" content="Umar Shoaib" />
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"headline": "${post.title.replace(/"/g, '\\"')}",
		"description": "${post.description.replace(/"/g, '\\"')}",
		"image": "${SITE}/images/umar.jpeg",
		"datePublished": "${post.date}",
		"dateModified": "${post.date}",
		"author": {
			"@type": "Person",
			"name": "Umar Shoaib",
			"url": "${SITE}/"
		},
		"publisher": {
			"@type": "Person",
			"name": "Umar Shoaib"
		},
		"mainEntityOfPage": {
			"@type": "WebPage",
			"@id": "${canonical}"
		}
	}
	</script>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700%7CMontserrat:400,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="../css/basic.css" />
	<link rel="stylesheet" href="../css/layout.css" />
	<link rel="stylesheet" href="../css/blogs.css" />
	<link rel="stylesheet" href="../css/blog-extras.css" />
	<link rel="stylesheet" href="../css/ionicons.css" />
	<link rel="shortcut icon" href="../images/favicons/favicon.svg" type="image/svg+xml" />
</head>
<body>
	<div class="page">
		<header class="header filled">
			<div class="fw">
				<div class="logo"><a href="../index.html" aria-label="Back to portfolio">U.</a></div>
				<div class="top-menu" style="position:static;opacity:1;visibility:visible;background:transparent;padding:0;width:auto;height:auto;">
					<ul>
						<li><a href="../index.html">Home</a></li>
						<li><a href="index.html">Blog</a></li>
						<li><a href="../index.html#contact-section">Contact</a></li>
					</ul>
				</div>
			</div>
		</header>
		<div class="container">
			<div class="blog-page-header">
				<a href="index.html">← All Blog Posts</a>
				<h1>${post.title}</h1>
				<p>${post.tag} · ${post.dateDisplay}</p>
			</div>
			<div class="section blog-post-page align-left" style="padding-top:0;">
				<div class="fw">
					<div class="blog-breadcrumb">
						<a href="../index.html">Home</a> / <a href="index.html">Blog</a> / ${post.title}
					</div>
					<div class="post-box">
						<div class="blog-image"><img src="${post.image}" alt="${post.title}" loading="lazy" style="border-radius:12px;" /></div>
						<div class="post-meta">${post.tag} · Published ${post.dateDisplay} · By <a href="../index.html">Umar Shoaib</a></div>
						<div class="post-content blog-content">${post.content.trim()}
							<p><strong>Need help with a similar project?</strong> <a href="mailto:contact@umarshoaib.com">contact@umarshoaib.com</a> · <a href="../index.html#contact-section">Get in touch</a></p>
						</div>
					</div>
				</div>
			</div>
			<footer class="align-center">
				<div class="copy">© 2026 Umar Shoaib — <a href="../index.html" style="color:inherit;">Portfolio</a> · <a href="index.html" style="color:inherit;">Blog</a></div>
			</footer>
		</div>
	</div>
</body>
</html>`;
}

function blogIndexHtml() {
	const cards = posts.map((post) => `
		<article class="blog-list-card">
			<div class="blog-thumb"><a href="${post.slug}.html"><img src="${post.image}" alt="${post.title}" loading="lazy" /></a></div>
			<div class="blog-body">
				<div class="blog-tag">${post.tag}</div>
				<h2 class="blog-title" style="font-size:1.2em;margin:0 0 10px 0;"><a href="${post.slug}.html">${post.title}</a></h2>
				<p class="blog-excerpt" style="margin:0 0 12px 0;">${post.description}</p>
				<div class="blog-date">${post.dateDisplay}</div>
			</div>
		</article>`).join('\n');

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Blog | Umar Shoaib — Full-Stack & AI Engineer</title>
	<meta name="description" content="Technical blog by Umar Shoaib covering Laravel, MERN stack, Python, AI, OpenAI API, computer vision, and freelance full-stack development." />
	<meta name="author" content="Umar Shoaib" />
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="canonical" href="${SITE}/blog/index.html" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="${SITE}/blog/index.html" />
	<meta property="og:title" content="Umar Shoaib Blog — Laravel, AI & Full-Stack Development" />
	<meta property="og:description" content="Technical articles on Laravel REST APIs, OpenAI integration, YOLO computer vision, Python ML, and freelance development." />
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Blog",
		"name": "Umar Shoaib Blog",
		"description": "Technical blog on Laravel, MERN, Python, AI, and full-stack development",
		"url": "${SITE}/blog/index.html",
		"author": { "@type": "Person", "name": "Umar Shoaib", "url": "${SITE}/" }
	}
	</script>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700%7CMontserrat:400,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="../css/basic.css" />
	<link rel="stylesheet" href="../css/layout.css" />
	<link rel="stylesheet" href="../css/blog-extras.css" />
	<link rel="stylesheet" href="../css/ionicons.css" />
	<link rel="shortcut icon" href="../images/favicons/favicon.svg" type="image/svg+xml" />
</head>
<body>
	<div class="page">
		<header class="header filled">
			<div class="fw">
				<div class="logo"><a href="../index.html">U.</a></div>
				<div class="top-menu" style="position:static;opacity:1;visibility:visible;background:transparent;padding:0;width:auto;height:auto;">
					<ul>
						<li><a href="../index.html">Home</a></li>
						<li class="active"><a href="index.html">Blog</a></li>
						<li><a href="../index.html#contact-section">Contact</a></li>
					</ul>
				</div>
			</div>
		</header>
		<div class="container">
			<div class="blog-page-header">
				<a href="../index.html">← Back to Portfolio</a>
				<h1>Blog</h1>
				<p>Laravel, AI, Python &amp; Full-Stack Development Articles</p>
			</div>
			<div class="section blog-list-page align-left" style="padding-top:0;">
				<div class="fw">
					<div class="blog-list-grid">${cards}
					</div>
				</div>
			</div>
			<footer class="align-center">
				<div class="copy">© 2026 Umar Shoaib · <a href="mailto:contact@umarshoaib.com" style="color:inherit;">contact@umarshoaib.com</a></div>
			</footer>
		</div>
	</div>
</body>
</html>`;
}

if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

posts.forEach((post) => {
	fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), postHtml(post), 'utf8');
});

fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHtml(), 'utf8');

fs.writeFileSync(
	path.join(__dirname, '..', 'js', 'blogs-meta.json'),
	JSON.stringify(posts.map(({ slug, title, description, tag, date, dateDisplay, image, featured }) => ({
		slug, title, description, tag, date, dateDisplay, image, featured
	})), null, 2),
	'utf8'
);

console.log(`Generated ${posts.length} blog posts + index`);
