const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'images', 'blog');

function esc(text) {
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function linesSvg(lines, x, lineHeight) {
	return lines
		.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? '0' : lineHeight}">${esc(line)}</tspan>`)
		.join('\n\t\t\t');
}

function blogThumbnailSvg(post) {
	const {
		slug,
		categoryLeft,
		categoryRight,
		titleLines,
		subtitleLines,
		tags,
		readTime,
		footerLines,
		accent = '#4ADE80'
	} = post;

	const tagSvg = tags
		.map((tag, i) => {
			const w = 108;
			const gap = 10;
			const x = 48 + i * (w + gap);
			return `
	<rect x="${x}" y="292" width="${w}" height="30" rx="15" fill="#12161F" stroke="#2A3344" stroke-width="1"/>
	<text x="${x + w / 2}" y="312" fill="#C5CAD3" font-family="Consolas, monospace" font-size="11" text-anchor="middle">${esc(tag)}</text>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${esc(titleLines.join(' '))}">
	<defs>
		<pattern id="grid-${slug}" width="40" height="40" patternUnits="userSpaceOnUse">
			<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#151B26" stroke-width="1"/>
		</pattern>
		<linearGradient id="bg-${slug}" x1="0" y1="0" x2="800" y2="450" gradientUnits="userSpaceOnUse">
			<stop offset="0%" stop-color="#0B0E14"/>
			<stop offset="100%" stop-color="#101622"/>
		</linearGradient>
	</defs>
	<rect width="800" height="450" fill="url(#bg-${slug})"/>
	<rect width="800" height="450" fill="url(#grid-${slug})" opacity="0.55"/>

	<rect x="48" y="42" width="28" height="2" fill="#5B9BD5"/>
	<text x="84" y="50" fill="#5B9BD5" font-family="Consolas, monospace" font-size="12" letter-spacing="1">${esc(categoryLeft)}</text>
	<text x="752" y="50" fill="#6B7280" font-family="Consolas, monospace" font-size="12" text-anchor="end">${esc(categoryRight)}</text>

	<text x="48" y="118" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700">
		${linesSvg(titleLines, 48, 46)}
	</text>

	<text x="48" y="228" fill="#8A8F98" font-family="Arial, Helvetica, sans-serif" font-size="15">
		${linesSvg(subtitleLines, 48, 22)}
	</text>

	${tagSvg}

	<line x1="48" y1="348" x2="752" y2="348" stroke="#1E2633" stroke-width="1"/>

	<text x="48" y="396" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">${esc(readTime)}</text>
	<text x="48" y="420" fill="#6B7280" font-family="Arial, Helvetica, sans-serif" font-size="13">read time</text>

	<line x1="390" y1="368" x2="390" y2="428" stroke="#1E2633" stroke-width="1"/>
	<text x="430" y="396" fill="#8A8F98" font-family="Arial, Helvetica, sans-serif" font-size="13">
		${linesSvg(footerLines, 430, 18)}
	</text>
</svg>`;
}

const blogs = [
	{
		slug: 'openai-api-laravel-integration',
		categoryLeft: 'BLOG • LARAVEL · AI',
		categoryRight: 'Jun 2026',
		titleLines: ['Integrating OpenAI API in', 'Laravel Applications'],
		subtitleLines: [
			'Secure API keys, reusable AI services, queues',
			'and production OpenAI integration patterns.'
		],
		tags: ['openai', 'laravel', 'api', 'queue', 'env'],
		readTime: '6 min',
		footerLines: ['By Umar Shoaib • Full-Stack & AI Engineer', 'Content generation • chatbots • automation'],
		accent: '#4ADE80'
	},
	{
		slug: 'laravel-rest-api-best-practices',
		categoryLeft: 'BLOG • LARAVEL · API',
		categoryRight: 'Jun 2026',
		titleLines: ['Laravel REST API', 'Best Practices'],
		subtitleLines: [
			'Authentication, validation, versioning,',
			'error handling and scalable API design.'
		],
		tags: ['rest', 'sanctum', 'rbac', 'redis', 'v1'],
		readTime: '7 min',
		footerLines: ['By Umar Shoaib • Backend Engineer', 'Production APIs • pagination • rate limits'],
		accent: '#F87171'
	},
	{
		slug: 'yolo-object-detection-guide',
		categoryLeft: 'BLOG • AI · VISION',
		categoryRight: 'Jun 2026',
		titleLines: ['YOLO Object Detection:', 'A Practical Guide'],
		subtitleLines: [
			'Model training, real-time inference,',
			'and deployment on CPU, GPU or edge devices.'
		],
		tags: ['yolo', 'opencv', 'train', 'gpu', 'edge'],
		readTime: '8 min',
		footerLines: ['By Umar Shoaib • AI Engineer', 'Computer vision • ~94% accuracy FYP'],
		accent: '#60A5FA'
	},
	{
		slug: 'mern-vs-laravel-backend-guide',
		categoryLeft: 'BLOG • FULL-STACK',
		categoryRight: 'May 2026',
		titleLines: ['MERN Stack vs Laravel:', 'Choosing the Backend'],
		subtitleLines: [
			'When to pick Node/MongoDB vs Laravel/MySQL',
			'for your next web application.'
		],
		tags: ['mern', 'laravel', 'node', 'mongo', 'mysql'],
		readTime: '5 min',
		footerLines: ['By Umar Shoaib • Full-Stack Engineer', 'Architecture decisions • team fit'],
		accent: '#A78BFA'
	},
	{
		slug: 'deploy-flask-ml-api-production',
		categoryLeft: 'BLOG • PYTHON · ML',
		categoryRight: 'May 2026',
		titleLines: ['Deploying Flask ML APIs', 'to Production'],
		subtitleLines: [
			'Gunicorn, Docker, model loading,',
			'monitoring and production ML endpoints.'
		],
		tags: ['flask', 'gunicorn', 'docker', 'ml', 'nginx'],
		readTime: '6 min',
		footerLines: ['By Umar Shoaib • AI Engineer', 'Inference APIs • model versioning'],
		accent: '#38BDF8'
	},
	{
		slug: 'mysql-vs-postgresql-web-apps',
		categoryLeft: 'BLOG • DATABASES',
		categoryRight: 'May 2026',
		titleLines: ['MySQL vs PostgreSQL', 'for Web Apps'],
		subtitleLines: [
			'Compare relational databases for Laravel,',
			'Node.js and production workloads in 2026.'
		],
		tags: ['mysql', 'postgres', 'jsonb', 'index', 'orm'],
		readTime: '5 min',
		footerLines: ['By Umar Shoaib • Backend Engineer', 'Schema design • query performance'],
		accent: '#FBBF24'
	},
	{
		slug: 'python-llm-chatbot-tutorial',
		categoryLeft: 'BLOG • PYTHON · AI',
		categoryRight: 'May 2026',
		titleLines: ['Building AI Chatbots', 'with Python & LLMs'],
		subtitleLines: [
			'Website crawling, RAG pipelines, semantic search',
			'and Flask deployment for chatbot APIs.'
		],
		tags: ['python', 'rag', 'crawler', 'flask', 'llm'],
		readTime: '7 min',
		footerLines: ['By Umar Shoaib • AI Engineer', 'OpenAI API • contextual responses'],
		accent: '#60A5FA'
	},
	{
		slug: 'laravel-role-based-access-control',
		categoryLeft: 'BLOG • LARAVEL · SECURITY',
		categoryRight: 'Apr 2026',
		titleLines: ['Role-Based Access Control', 'in Laravel'],
		subtitleLines: [
			'Policies, gates, middleware and permissions',
			'for secure multi-role applications.'
		],
		tags: ['rbac', 'policies', 'gates', 'roles', 'auth'],
		readTime: '6 min',
		footerLines: ['By Umar Shoaib • Backend Engineer', 'Multi-role apps • authorization'],
		accent: '#F87171'
	},
	{
		slug: 'n8n-automation-for-developers',
		categoryLeft: 'BLOG • DEVOPS · AUTO',
		categoryRight: 'Apr 2026',
		titleLines: ['n8n Workflow Automation', 'for Developers'],
		subtitleLines: [
			'Connect APIs, automate data sync, integrate OpenAI',
			'and reduce manual ops in Laravel projects.'
		],
		tags: ['n8n', 'webhooks', 'cron', 'sync', 'apis'],
		readTime: '5 min',
		footerLines: ['By Umar Shoaib • Full-Stack Engineer', 'Workflow automation • integrations'],
		accent: '#4ADE80'
	},
	{
		slug: 'freelance-full-stack-developer-tips',
		categoryLeft: 'BLOG • FREELANCE · CAREER',
		categoryRight: 'Apr 2026',
		titleLines: ['Freelance Full-Stack', 'Developer Tips'],
		subtitleLines: [
			'Client communication, scoping, milestones,',
			'pricing and building long-term relationships.'
		],
		tags: ['scope', 'client', 'remote', 'delivery', 'docs'],
		readTime: '6 min',
		footerLines: ['By Umar Shoaib • Freelance Developer', 'Lessons from real client projects'],
		accent: '#A78BFA'
	}
];

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

blogs.forEach((blog) => {
	const svg = blogThumbnailSvg(blog);
	fs.writeFileSync(path.join(outDir, `${blog.slug}.svg`), svg, 'utf8');
	console.log('Created', `${blog.slug}.svg`);
});

module.exports = { blogs, outDir, blogThumbnailSvg };
