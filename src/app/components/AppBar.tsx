'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const AppBar = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
            <WalletMultiButton />
        </div>
    );
};

export default AppBar;
