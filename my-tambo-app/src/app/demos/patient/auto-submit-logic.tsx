// Auto-submit user message from sessionStorage with enhanced debugging
React.useEffect(() => {
    console.log('[AUTO-SUBMIT] useEffect triggered');
    const userMessage = sessionStorage.getItem('userMessage');
    console.log('[AUTO-SUBMIT] Found message in sessionStorage:', userMessage);

    if (userMessage) {
        sessionStorage.removeItem('userMessage');
        console.log('[AUTO-SUBMIT] Removed message from sessionStorage');

        // Wait longer for Tambo to fully initialize
        const initTimer = setTimeout(() => {
            console.log('[AUTO-SUBMIT] Starting auto-submission process...');

            const textarea = document.querySelector('textarea');
            console.log('[AUTO-SUBMIT] Found textarea:', !!textarea);

            if (textarea) {
                textarea.value = userMessage;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('[AUTO-SUBMIT] Set textarea value and dispatched events');

                const clickTimer = setTimeout(() => {
                    const form = textarea.closest('form');
                    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement;

                    console.log('[AUTO-SUBMIT] Found form:', !!form);
                    console.log('[AUTO-SUBMIT] Found submit button:', !!submitBtn);

                    if (submitBtn) {
                        console.log('[AUTO-SUBMIT] Clicking submit button...');
                        submitBtn.click();
                        console.log('[AUTO-SUBMIT] ✅ SUCCESS - Message submitted!');
                    } else {
                        console.error('[AUTO-SUBMIT] ❌ FAILED - No submit button found');
                    }
                }, 500);

                return () => clearTimeout(clickTimer);
            } else {
                console.error('[AUTO-SUBMIT] ❌ FAILED - No textarea found');
            }
        }, 2000); // Wait 2 seconds for Tambo

        return () => clearTimeout(initTimer);
    } else {
        console.log('[AUTO-SUBMIT] No message found, skipping auto-submission');
    }
}, []);
