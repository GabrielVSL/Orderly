# Backend API Documentation

This document details the API endpoints for the e-commerce system.

## Products

### `GET /api/products`

* **Description:** Fetches a list of all available products.
* **Success Response (200):**
    ```json
    [
      {
        "id": 1,
        "name": "Classic Burger",
        "description": "A juicy beef patty...",
        "price": "15.99"
      }
    ]
    ```

## Cart

### `POST /api/cart`

* **Description:** Adds a product to the cart. If the item already exists in the cart, its quantity is updated.
* **Body (JSON):**
    ```json
    {
      "productId": 1,
      "quantity": 2
    }
    ```
* **Success Response (201):**
    * Returns the new or updated cart item.
    * Validates that quantity is between 1 and 10
* **Error Responses:**
    * `404 Not Found`: If `productId` does not exist.
    * `400 Bad Request`: If quantity exceeds 10

    ### `GET /api/cart`

* **Description:** Fetches all items currently in the cart.
* **Success Response (200):**
    * Returns a JSON array of all cart items, with the full `product` object nested inside each item.
    ```json
    [
      {
        "id": 1,
        "productId": 1,
        "quantity": 9,
        "product": {
          "id": 1,
          "name": "Classic Burger",
          "price": 15.99,
          ...
        }
      }
    ]
    ```