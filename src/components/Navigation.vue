<template>
    <nav>
       <span>Home</span>
       <span>Locations</span>
       <span>Parkings</span>
       <span>Service</span>
       <span>Account</span>
    </nav>
</template>

<style scoped>
nav{
    background: aliceblue;
    height: 50px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: 'Lucida Sans',sans-serif;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 16px;
}
nav span {
    margin: 16px;
}
</style>