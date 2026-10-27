# Shopping List Application Detailed Design Document

## Requirements & Use Cases
*   **Real-time Synchronization:** Multiple users can view and edit the same list simultaneously; changes reflect instantly.
*   **List Management:** Create, delete, and rename multiple shopping lists (e.g., "Weekly Groceries", "Hardware Store").
*   **Item CRUD Operations:**
    *   **Create:** Add new items to a list via text input or voice commands. Use autocomplete based on history.
    *   **Read:** View all active items in a list.
    *   **Update:** Modify item name, quantity, or attach an image.
    *   **Delete:** Remove an item from the list.
*   **Status Toggling:** Mark an item as "bought" (V mark). Once marked, the item is removed from the active view but stored in the historical data.
*   **Voice Control:** Enable an AI agent to read back items, add items, or remove items from the list via an MCP integration.
*   **UI/UX:** Hebrew interface with RTL layout. Support full-size image viewing for items.

## Architecture
*   **Frontend:** Web application built with Vue.js, designed for responsive mobile and desktop use.
*   **Backend:** Firebase platform.
*   **Database:** Firestore (NoSQL) for real-time synchronization and offline capabilities.
*   **Authentication:** Firebase Authentication for secure user sign-in and authorization.
*   **Agent Interaction:** MCP Server acting as a bridge between the AI agent and Firestore.
*   **Hosting:** Firebase Hosting (Free Spark Tier).

## Data Model & Database Schema

### Collection: `lists`
Represents individual shopping lists.
*   `id`: String (Firestore auto-generated)
*   `name`: String (Name of the list, e.g., "Home")
*   `householdId`: String (ID of the associated household)

### Collection: `household_members`
Links users to their respective households.
*   `userId`: String
*   `householdId`: String

### Collection: `items`
Represents individual items within a specific list.
*   `id`: String (Firestore auto-generated or timestamp-based)
*   `listId`: String (Reference to `lists.id`)
*   `name`: String (Product name)
*   `quantity`: String/Number (Amount needed)
*   `checked`: Boolean (True if bought, False if active)
*   `imageUrl`: String (URL to the product image)
*   `updatedAt`: Timestamp (When the item was last modified)

### Global Collection: `product_history`
Stores all unique products ever added across all lists to power the autocomplete/suggestion engine.
*   `name`: String (Unique product name)
*   `category`: String (Optional, for future sorting)

## UX/UI Workflows

### Main Screen (Active List)
1.  **Display:** Shows items with `checked: false` in a vertical list.
2.  **Action:** Clicking the checkbox sets `checked: true`, which immediately removes the item from the active view.
3.  **Visuals:** Item name and quantity are clear. An image icon is shown if an image is attached; clicking it expands the image to full-screen.

### Add Product Flow
1.  **Input:** A text field for adding a new product.
2.  **Suggestion Engine:** As the user types, a dropdown appears showing matching products from `product_history`.
3.  **Submission:** The user can select a suggested product or type a new name.
4.  **Action:** The item is created with `checked: false` and added to the selected list's `items` sub-collection.

## Security & Permissions (Firestore Security Rules)
*   Users must be authenticated.
*   A user can only read/write documents linked to their `householdId`.
*   Anyone within the household can create a list or add members.
