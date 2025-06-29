<template>
    <div class="page-404">
        <div class="content">
            <img src="../assets/404.png" alt="Page introuvable" />
            <h1>Oops ! Cette page est introuvable</h1>
            <p>Il semble que la page que vous recherchez n'existe pas ou a été déplacée.</p>
            <router-link to="/" class="home-button">Retour à l’accueil</router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.page-404 {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(to bottom right, #d1e3f5, #d1e3f5);
    text-align: center;
    padding: 1.5rem;
}

.content img {
    max-width: 300px;
    width: 100%;
    margin-bottom: 2rem;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
}

p {
    margin-bottom: 2rem;
    color: #666;
}

.home-button {
    background-color: #4895ef;
    color: white;
    padding: 0.8rem 1.5rem;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: bold;
    transition: background-color 0.3s;
}

.home-button:hover {
    background-color: #4361ee;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
