import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const formData = new FormData();
    formData.append('file', buffer, file.name);

    const pinataMetadata = JSON.stringify({
        name: file.name,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: Infinity,
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${process.env.PINATA_JWT}`
            }
        });
        return NextResponse.json({ ipfsHash: res.data.IpfsHash }, { status: 200 });
    } catch (error) {
        console.error('Pinata API Error:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Error uploading to Pinata' }, { status: 500 });
    }
}
