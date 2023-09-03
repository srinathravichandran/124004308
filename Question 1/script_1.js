document.getElementById('numberForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const urlsInput = document.getElementById('urls');
    const responseContainer = document.getElementById('response');
    const responseTimeContainer = document.getElementById('responseTime');

    const urls = urlsInput.value.split(',').map(url => url.trim());
    const startTime = performance.now();

    try {
        const responses = await Promise.all(urls.map(fetchNumbers));
        const mergedNumbers = responses.reduce((acc, response) => acc.concat(response.numbers), []);
        const uniqueNumbers = [...new Set(mergedNumbers)].sort((a, b) => a - b);

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        responseContainer.textContent = JSON.stringify({ numbers: uniqueNumbers }, null, 2);
        responseTimeContainer.textContent = `Response time: ${responseTime.toFixed(2)} milliseconds`;
    } catch (error) {
        responseContainer.textContent = `Error: ${error.message}`;
        responseTimeContainer.textContent = '';
    }
});

async function fetchNumbers(url) {
    const response = await fetch(`http://localhost:8008/numbers?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
}

