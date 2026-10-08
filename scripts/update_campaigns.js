const API_URL = "https://tunnel.yuwaindia.org/api/v1/admin/campaign/add-campaign";

const token = process.argv[2];

if (!token) {
  console.error("Please provide your JWT token as the first argument.");
  console.error("Usage: node update_campaigns.js <YOUR_JWT_TOKEN>");
  process.exit(1);
}

const campaignsData = [
  {
    title: { en: "Educate a Child", hi: "एक बच्चे को शिक्षित करें" },
    description: { en: "Support education for children from underprivileged communities.", hi: "वंचित समुदायों के बच्चों की शिक्षा में सहयोग करें।" },
    goalAmount: 500000,
    category: { en: "Education & Child Welfare", hi: "शिक्षा और बाल कल्याण" },
    summary: { en: "Support education for children from underprivileged communities.", hi: "वंचित समुदायों के बच्चों की शिक्षा में सहयोग करें।" },
    location: { en: "Pan India", hi: "संपूर्ण भारत" },
    keyPoints: { en: ["Support child education"], hi: ["बाल शिक्षा का समर्थन करें"] },
    existingImages: ["https://res.cloudinary.com/deh3sqesi/image/upload/v1791440995/Campaigns/tlolufsktahmkit16igj.jpg"]
  },
  {
    title: { en: "Educate a Girl", hi: "एक बालिका को शिक्षित करें" },
    description: { en: "Help a girl access quality education and build a better future.", hi: "एक बालिका को गुणवत्तापूर्ण शिक्षा प्राप्त करने और बेहतर भविष्य बनाने में सहयोग करें।" },
    goalAmount: 500000,
    category: { en: "Women Empowerment", hi: "महिला सशक्तिकरण" },
    summary: { en: "Help a girl access quality education and build a better future.", hi: "एक बालिका को गुणवत्तापूर्ण शिक्षा प्राप्त करने और बेहतर भविष्य बनाने में सहयोग करें।" },
    location: { en: "Pan India", hi: "संपूर्ण भारत" },
    keyPoints: { en: ["Support girl child education"], hi: ["बालिका शिक्षा का समर्थन करें"] },
    existingImages: ["https://res.cloudinary.com/deh3sqesi/image/upload/v1791440995/Campaigns/tlolufsktahmkit16igj.jpg"]
  },
  {
    title: { en: "Food & Nutrition Support", hi: "भोजन एवं पोषण सहायता" },
    description: { en: "Provide nutritious food and essential support to children and families in need.", hi: "जरूरतमंद बच्चों और परिवारों को पौष्टिक भोजन एवं आवश्यक सहायता प्रदान करने में सहयोग करें।" },
    goalAmount: 500000,
    category: { en: "Health & Nutrition", hi: "स्वास्थ्य और पोषण" },
    summary: { en: "Provide nutritious food and essential support to children and families in need.", hi: "जरूरतमंद बच्चों और परिवारों को पौष्टिक भोजन एवं आवश्यक सहायता प्रदान करने में सहयोग करें।" },
    location: { en: "Pan India", hi: "संपूर्ण भारत" },
    keyPoints: { en: ["Provide food and nutrition"], hi: ["भोजन एवं पोषण सहायता प्रदान करें"] },
    existingImages: ["https://res.cloudinary.com/deh3sqesi/image/upload/v1791440995/Campaigns/tlolufsktahmkit16igj.jpg"]
  },
  {
    title: { en: "Women Empowerment", hi: "महिला सशक्तिकरण" },
    description: { en: "Support skill development and livelihood opportunities for women and girls.", hi: "महिलाओं और बालिकाओं के कौशल विकास एवं आजीविका के अवसरों में सहयोग करें।" },
    goalAmount: 500000,
    category: { en: "Women Empowerment", hi: "महिला सशक्तिकरण" },
    summary: { en: "Support skill development and livelihood opportunities for women and girls.", hi: "महिलाओं और बालिकाओं के कौशल विकास एवं आजीविका के अवसरों में सहयोग करें।" },
    location: { en: "Pan India", hi: "संपूर्ण भारत" },
    keyPoints: { en: ["Support women empowerment"], hi: ["महिला सशक्तिकरण का समर्थन करें"] },
    existingImages: ["https://res.cloudinary.com/deh3sqesi/image/upload/v1791440995/Campaigns/tlolufsktahmkit16igj.jpg"]
  },
  {
    title: { en: "Healthcare Support", hi: "स्वास्थ्य सेवा सहायता" },
    description: { en: "Help provide essential healthcare and medical support to those in need.", hi: "जरूरतमंद लोगों को आवश्यक स्वास्थ्य सेवाएं एवं चिकित्सा सहायता उपलब्ध कराने में सहयोग करें।" },
    goalAmount: 500000,
    category: { en: "Health & Nutrition", hi: "स्वास्थ्य और पोषण" },
    summary: { en: "Help provide essential healthcare and medical support to those in need.", hi: "जरूरतमंद लोगों को आवश्यक स्वास्थ्य सेवाएं एवं चिकित्सा सहायता उपलब्ध कराने में सहयोग करें।" },
    location: { en: "Pan India", hi: "संपूर्ण भारत" },
    keyPoints: { en: ["Provide healthcare support"], hi: ["स्वास्थ्य सेवा सहायता प्रदान करें"] },
    existingImages: ["https://res.cloudinary.com/deh3sqesi/image/upload/v1791440995/Campaigns/tlolufsktahmkit16igj.jpg"]
  },
  {
    title: { en: "Environment Protection", hi: "पर्यावरण संरक्षण" },
    description: { en: "Join us in creating a cleaner, greener and healthier environment.", hi: "स्वच्छ, हरित और स्वस्थ पर्यावरण बनाने के हमारे प्रयास में शामिल हों।" },
    goalAmount: 500000,
    category: { en: "Environment & Awareness", hi: "पर्यावरण और जागरूकता" },
    summary: { en: "Join us in creating a cleaner, greener and healthier environment.", hi: "स्वच्छ, हरित और स्वस्थ पर्यावरण बनाने के हमारे प्रयास में शामिल हों।" },
    location: { en: "Pan India", hi: "संपूर्ण भारत" },
    keyPoints: { en: ["Promote environment protection"], hi: ["पर्यावरण संरक्षण को बढ़ावा दें"] },
    existingImages: ["https://res.cloudinary.com/deh3sqesi/image/upload/v1791440995/Campaigns/tlolufsktahmkit16igj.jpg"]
  }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  for (const campaign of campaignsData) {
    const formData = new FormData();
    formData.append("title", JSON.stringify(campaign.title));
    formData.append("description", JSON.stringify(campaign.description));
    formData.append("goalAmount", campaign.goalAmount.toString());
    formData.append("category", JSON.stringify(campaign.category));
    formData.append("summary", JSON.stringify(campaign.summary));
    formData.append("location", JSON.stringify(campaign.location));
    formData.append("keyPoints", JSON.stringify(campaign.keyPoints));
    
    // Add images
    campaign.existingImages.forEach(img => formData.append("existingImages", img));

    console.log(`Creating campaign: ${campaign.title.en}...`);
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error(`Failed to create ${campaign.title.en}:`, result.message || response.statusText);
      } else {
        console.log(`Successfully created: ${campaign.title.en}`);
      }
    } catch (e) {
      console.error(`Error during fetch for ${campaign.title.en}:`, e.message);
    }
    
    // Slight delay to prevent rate limit issues
    await sleep(500);
  }
  
  console.log("\nFinished processing all 6 campaigns! You can now verify the frontend.");
}

run();
