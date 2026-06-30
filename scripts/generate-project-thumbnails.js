const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'images', 'works');

function esc(text) {
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function linesSvg(lines, x, startY, lineHeight, attrs) {
	return lines
		.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? '0' : lineHeight}">${esc(line)}</tspan>`)
		.join('\n\t\t\t');
}

function thumbnailSvg(project) {
	const {
		id,
		categoryLeft,
		categoryRight,
		titleLines,
		subtitleLines,
		tags,
		statValue,
		statLabel,
		footerLines,
		accent = '#4ADE80'
	} = project;

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
		<pattern id="grid-${id}" width="40" height="40" patternUnits="userSpaceOnUse">
			<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#151B26" stroke-width="1"/>
		</pattern>
		<linearGradient id="bg-${id}" x1="0" y1="0" x2="800" y2="450" gradientUnits="userSpaceOnUse">
			<stop offset="0%" stop-color="#0B0E14"/>
			<stop offset="100%" stop-color="#101622"/>
		</linearGradient>
	</defs>
	<rect width="800" height="450" fill="url(#bg-${id})"/>
	<rect width="800" height="450" fill="url(#grid-${id})" opacity="0.55"/>

	<rect x="48" y="42" width="28" height="2" fill="#5B9BD5"/>
	<text x="84" y="50" fill="#5B9BD5" font-family="Consolas, monospace" font-size="12" letter-spacing="1">${esc(categoryLeft)}</text>
	<text x="752" y="50" fill="#6B7280" font-family="Consolas, monospace" font-size="12" text-anchor="end">${esc(categoryRight)}</text>

	<text x="48" y="118" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">
		${linesSvg(titleLines, 48, 118, 52)}
	</text>

	<text x="48" y="228" fill="#8A8F98" font-family="Arial, Helvetica, sans-serif" font-size="15">
		${linesSvg(subtitleLines, 48, 228, 22)}
	</text>

	${tagSvg}

	<line x1="48" y1="348" x2="752" y2="348" stroke="#1E2633" stroke-width="1"/>

	<text x="48" y="396" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">${esc(statValue)}</text>
	<text x="48" y="420" fill="#6B7280" font-family="Arial, Helvetica, sans-serif" font-size="13">${esc(statLabel)}</text>

	<line x1="390" y1="368" x2="390" y2="428" stroke="#1E2633" stroke-width="1"/>
	<text x="430" y="396" fill="#8A8F98" font-family="Arial, Helvetica, sans-serif" font-size="13">
		${linesSvg(footerLines, 430, 396, 18)}
	</text>
</svg>`;
}

const projects = [
	{
		id: 'vehicle',
		file: 'vehicle-inventory-system',
		categoryLeft: 'LARAVEL • BACKEND',
		categoryRight: 'OpenAI',
		titleLines: ['Vehicle Inventory &', 'Dealer System'],
		subtitleLines: [
			'AI vehicle platform with auto-generated descriptions,',
			'dealer RBAC profiles, pricing & n8n automation.'
		],
		tags: ['inventory', 'dealers', 'openai', 'rbac', 'n8n'],
		statValue: 'SOLID',
		statLabel: 'architecture',
		footerLines: ['Role-based dealer access • OpenAI descriptions', 'MySQL schema • n8n automated sync']
	},
	{
		id: 'chatbot',
		file: 'ai-website-chatbot',
		categoryLeft: 'AI • PYTHON',
		categoryRight: 'LLMs',
		titleLines: ['AI Website-Crawling', 'Chatbot'],
		subtitleLines: [
			'RAG chatbot that crawls websites and answers queries',
			'from live content using semantic search & LLMs.'
		],
		tags: ['crawler', 'rag', 'semantic', 'flask', 'llm'],
		statValue: 'Full-site',
		statLabel: 'content indexing',
		footerLines: ['OpenAI API contextual responses', 'Flask API • backend-ready integration'],
		accent: '#60A5FA'
	},
	{
		id: 'vibelyt',
		file: 'vibelyt-music-app',
		categoryLeft: 'BACKEND • LARAVEL',
		categoryRight: 'REST API',
		titleLines: ['Vibelyt Music', 'Application'],
		subtitleLines: [
			'Music app backend with uploads, playlists, AI recs,',
			'analytics, notifications, social & gift card features.'
		],
		tags: ['uploads', 'playlists', 'ai_recs', 'analytics', 'social'],
		statValue: '25+',
		statLabel: 'backend features',
		footerLines: ['Artist fanbase • smart queue • gift cards', 'Admin logs • offline queue • activity feed'],
		accent: '#A78BFA'
	},
	{
		id: 'yachting',
		file: 'yachting-crew-app',
		categoryLeft: 'BACKEND • MULTI-ROLE',
		categoryRight: 'Laravel',
		titleLines: ['Yachting / Crew', 'Member App'],
		subtitleLines: [
			'Marine job platform for yacht owners, crew & admins',
			'with booking, profiles, messaging & secure auth.'
		],
		tags: ['yacht_owner', 'crew', 'booking', 'messaging', 'admin'],
		statValue: '3 roles',
		statLabel: 'user types',
		footerLines: ['Job posting • crew profiles • real-time chat', 'Secure auth • full admin oversight'],
		accent: '#38BDF8'
	},
	{
		id: 'whiz',
		file: 'whiz-academy-website',
		categoryLeft: 'MERN STACK • WEB',
		categoryRight: 'React',
		titleLines: ['Whiz Academy', 'Full-Stack Website'],
		subtitleLines: [
			'Course showcase platform with instructors, resources',
			'and fast responsive MERN stack architecture.'
		],
		tags: ['react', 'nodejs', 'mongodb', 'courses', 'express'],
		statValue: '95%',
		statLabel: 'user satisfaction',
		footerLines: ['Courses • instructors • student resources', 'Responsive design • fast load times'],
		accent: '#4ADE80'
	}
];

projects.forEach((project) => {
	const svg = thumbnailSvg(project);
	fs.writeFileSync(path.join(outDir, `${project.file}.svg`), svg, 'utf8');
	console.log('Created', `${project.file}.svg`);
});

module.exports = { projects, outDir, thumbnailSvg };
