// Vercel serverless function: forwards contact form submission to Formspree.
// This avoids browser CORS issues because the request is made server-side.

const FORM_URL = 'https://formspree.io/f/maqpkeqo';

function readBody(req) {
	return new Promise((resolve, reject) => {
		let data = '';
		req.on('data', (chunk) => {
			data += chunk;
		});
		req.on('end', () => resolve(data));
		req.on('error', reject);
	});
}

module.exports = async (req, res) => {
	if (req.method !== 'POST') {
		res.status(405).json({ status: 'error', message: 'Method not allowed' });
		return;
	}

	try {
		const contentType = req.headers['content-type'] || '';
		const rawBody = await readBody(req);

		// We expect application/x-www-form-urlencoded from $("#cform").serialize()
		const formParams = new URLSearchParams(
			contentType.includes('application/x-www-form-urlencoded') ? rawBody : rawBody
		);

		const payload = new URLSearchParams();
		for (const [key, value] of formParams.entries()) {
			// Forward only known fields (prevents accidental forwarding of extra values).
			if (key === 'name' || key === 'tel' || key === 'email' || key === 'subject' || key === 'message') {
				let v = String(value || '').trim();
				// Basic length caps to avoid abuse.
				if (key === 'name' || key === 'tel') v = v.slice(0, 100);
				if (key === 'subject') v = v.slice(0, 200);
				if (key === 'message') v = v.slice(0, 5000);
				payload.append(key, v);
			}
		}

		const formResp = await fetch(FORM_URL, {
			method: 'POST',
			headers: {
				'accept': 'application/json',
				'content-type': 'application/x-www-form-urlencoded'
			},
			body: payload.toString()
		});

		if (!formResp.ok) {
			const text = await formResp.text().catch(() => '');
			res.status(500).json({ status: 'error', message: 'Form send failed', details: text });
			return;
		}

		res.status(200).json({ status: 'ok' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

