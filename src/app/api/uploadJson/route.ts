import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    const body = await req.json();

    // Check if PINATA_JWT is configured
    if (!process.env.PINATA_JWT) {
        console.error('PINATA_JWT environment variable is not set');
        return NextResponse.json({ 
            error: 'Pinata JWT not configured. Please add PINATA_JWT to your .env.local file' 
        }, { status: 500 });
    }

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", body, {
            headers: {
                'Authorization': `Bearer ${process.env.PINATA_JWT}`
            }
        });
        const ipfsHash = res.data.IpfsHash;
        const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        return NextResponse.json({ url }, { status: 200 });
    } catch (error) {
        console.error('Error uploading JSON to Pinata:', error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ 
                error: 'Error uploading JSON to Pinata',
                details: error.response?.data || error.message
            }, { status: 500 });
        }
        return NextResponse.json({ error: 'Error uploading JSON to Pinata' }, { status: 500 });
    }
}
