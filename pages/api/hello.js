
export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({ name: 'John Doe' });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
    // res.status(200).json({ name: 'John Doe' });
}