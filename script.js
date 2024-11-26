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
document.getElementById('passwordResetForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('تم تغيير كلمة السر بنجاح!');
});
