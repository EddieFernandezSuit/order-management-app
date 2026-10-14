# Order Management App

A food-delivery order management feature: browse the menu, add items to a cart, place an order with delivery details, and track the order status.

## Tech Stack

- **Backend:** Node.js, Express 5, in-memory data store, Vitest + Supertest
- **Frontend:** React 19, Vite, React Router, Axios, Vitest + Testing Library

## Project Structure

```
order-management-app/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app + middleware
│   │   ├── server.js           # HTTP server entry point
│   │   ├── data/               # In-memory stores (menu, orders)
│   │   └── routes/             # REST route handlers
│   └── tests/                  # API tests (Vitest + Supertest)
└── frontend/
    └── src/
        ├── pages/              # Route-level components
        └── __tests__/          # Component tests
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev        # start with nodemon on http://localhost:5000
npm test           # run API tests
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # start Vite dev server
npm test           # run component tests
```

Set the API base URL for the frontend with an environment variable (see `.env.example`):

```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

| Method | Path                       | Description                      |
| ------ | -------------------------- | -------------------------------- |
| GET    | `/api/menu`                | List all menu items              |
| GET    | `/api/orders`              | List all orders                  |
| POST   | `/api/orders`              | Place a new order                |
| GET    | `/api/orders/:id`          | Get a single order by id         |
| PATCH  | `/api/orders/:id/status`   | Update an order's status         |
| DELETE | `/api/orders/:id`          | Delete an order                  |

### Order status flow

`Order Received` → `Preparing` → `Out for Delivery` → `Delivered`

### Example: place an order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{ "menuItemId": 1, "qty": 2 }],
    "delivery": { "name": "Jane", "address": "123 Main St", "phone": "1234567890" }
  }'
```

Prices and totals are computed server-side from the menu; client-sent prices are ignored.

## Validation Rules

- `items` must be a non-empty array.
- Each item's `menuItemId` must exist in the menu and `qty` must be a positive integer.
- `delivery.name`, `delivery.address`, and `delivery.phone` are required.
- `delivery.phone` must be 7–15 digits.
- Order status updates must use one of the allowed statuses.

## Testing

Tests are written following TDD:

- Backend: menu retrieval, order CRUD, validation, server-side pricing, and error handling.
- Frontend: key UI components (menu, cart, checkout, order status).

## License

ISC
