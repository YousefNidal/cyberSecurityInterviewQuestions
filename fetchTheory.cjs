const fs = require('fs');
const path = require('path');

const topics = [
  { id: 'ports', title: 'Computer port (hardware)', query: 'Computer_port_(hardware)' },
  { id: 'threats', title: 'Malware', query: 'Malware' },
  { id: 'phishing', title: 'Phishing', query: 'Phishing' },
  { id: 'osint', title: 'Open-source intelligence', query: 'Open-source_intelligence' },
  { id: 'crypto', title: 'Cryptography', query: 'Cryptography' },
  { id: 'security', title: 'Computer Security', query: 'Computer_security' },
  { id: 'ctf', title: 'Capture the flag (cybersecurity)', query: 'Capture_the_flag_(cybersecurity)' },
  { id: 'pentest', title: 'Penetration test', query: 'Penetration_test' }
];

async function fetchTheoryData() {
  const titles = topics.map(t => t.query).join('|');
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${titles}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    const pages = data.query.pages;
    const theoryData = [];

    for (const pageId in pages) {
      const page = pages[pageId];
      // find matching topic
      const topic = topics.find(t => page.title === t.title.replace(/_/g, ' ') || page.title === t.query.replace(/_/g, ' '));
      if (topic) {
        theoryData.push({
          id: topic.id,
          title: topic.title.replace(/_/g, ' '),
          content: page.extract
        });
      }
    }

    const targetPath = path.join(__dirname, 'src', 'data');
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    fs.writeFileSync(path.join(targetPath, 'theory.json'), JSON.stringify(theoryData, null, 2));
    console.log(`Successfully fetched theory data for ${theoryData.length} topics from Wikipedia API.`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchTheoryData();
