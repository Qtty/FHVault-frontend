# FHVault-Frontend

## Goals

for the frontend, first there's gonna be a landing page where the user will be checked if he has a wallet or not(using metamask), if he doesn't then an error page is shown saying 'you need to install metamask'. If he does have metamask, a dashoboard is shown where there's his vaults on a left sidebar, a top bar where there are two buttons to create an item/vault and a middle screen where the items will be listed, when the user clicks on an item, a modal will be shows where he'll find the info of it's item and a button to reveal the password.

### Main Goals

1. a landing page where a welcome message will be shown while loading the data, if the user has no metamask, he'll be shown an error message, if he does, a loading message will be shown.

2. the dashboard, where the user will be redirected after the loading is complete, the dashboard will have:
    1. a topbar where there'll be two buttons:
        1. a button to create an item, when clicked it shows a modal with a form to create the item.
        2. a button to create a vault, when clicked it shows a modal with a form to create the vault.
    2. a sidebar on the left, where the vaults will be listed.
    3. a center screen where the items of the selected vault will be listed.
    4. when an item is clicked, a modal will be shown with the info of that item
