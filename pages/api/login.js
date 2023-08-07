import { withIronSession } from 'next-iron-session'

export default withIronSession(
	async (req, res) => {
		if (req.method === 'POST') {
			const { user } = req.body

			// To avoid Error: next-iron-session: Cookie length is too big 4228, browsers will refuse it
			delete user?.seller_produce
			delete user?.jwt_payload
			delete user?.companysummaryISsmallplaintextbox
			delete user?.companydescriptionISsmallplaintextbox

			console.log(user)
			if (user) {
				req.session.set('user', { user })
				await req.session.save()
				return res.status(201).send('')
			}

			return res.status(403).send('')
		}

		return res.status(404).send('')
	},
	{
		cookieName: process.env.COOKIE_NAME,
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production' ? true : false,
		},
		password: process.env.APPLICATION_SECRET,
	}
)
