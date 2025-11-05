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

### `DELETE /api/cart/:id`

* **Description:** Removes a single item from the cart by its *cart item ID* (the `id` of the row in `cart_items`, not the `productId`).
* **Parameters:**
    * `id` (URL param): The unique ID of the cart item to delete (e.g., `7`).
* **Success Response (204):**
    * Returns an empty body with a `204 No Content` status, indicating successful deletion.
* **Error Responses:**
    * `404 Not Found`: If `cartItemId` does not exist.

### `PUT /api/cart/:id`

* **Description:** Updates the quantity of a single item in the cart.
* **Parameters:**
    * `id` (URL param): The unique ID of the cart item to update (e.g., `7`).
* **Body (JSON):**
    ```json
    {
      "quantity": 5
    }
    ```
* **Success Response (200):**
    * Returns the full, updated cart item (with the nested `product` object).
* **Error Responses:**
    * `404 Not Found`: If `cartItemId` does not exist.
    * `400 Bad Request`: If `quantity` is less than 1 or greater than 10.

### Orders

### `POST /api/orders`

* **Description:** Processes a simulated checkout. This action will clear all items from the user's cart.
* **Body:** (Empty)
* **Success Response (200):**
    * Returns a success message.
    ```json
    {
      "message": "Order processed successfully."
    }
    ```
* **Error Responses:**
    * `500 Internal Server Error`: If clearing the cart fails.