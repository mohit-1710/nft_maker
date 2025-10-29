import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    const body = await req.json();

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
        console.error(error);
        return NextResponse.json({ error: 'Error uploading JSON to Pinata' }, { status: 500 });
    }
}
