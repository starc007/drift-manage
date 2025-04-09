# Drift

A web application for managing Drift Protocol subaccounts, allowing users to view their portfolio value, manage deposits and withdrawals, and track their positions.

## Features

- View total portfolio value across all subaccounts
- Manage deposits and withdrawals
- Track spot and perpetual positions
- Real-time balance updates
- Support for multiple subaccounts

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Drift Protocol SDK
- Solana Web3
- ZustandNEXT_PUBLIC_RPC_URL

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/starc007/drift-manage.git
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_RPC_URL=your_solana_rpc_url
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `components/` - React components
  - `appComp/` - Main application components
    - `Subaccounts/` - Subaccount management components
- `utils/` - Utility functions and calculations
- `store/` - State management
- `hooks/` - Custom React hooks
- `service/` - External service integrations
