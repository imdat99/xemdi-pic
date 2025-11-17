import { defineComponent, onErrorCaptured, ref } from "vue";

export function withErrorBoundary(WrappedComponent: any) {
    return defineComponent({
        name: `WithErrorBoundary(${WrappedComponent.name})`,
        render() {
            if (this.hasError) {
                return (
                    <div class="flex items-center justify-center min-h-screen-sm">
                        <div class="p-8 space-y-lg max-w-lg w-full">
                            <p>
                                <b>500.&nbsp;</b>
                                <ins class="text-gray-500 decoration-none">Đã xảy ra lỗi.</ins>
                            </p>
                            <div class="font-thin">
                                <p>Máy chủ đang gặp sự cố tạm thời và không thể xử lý yêu cầu của bạn. Vui lòng <a class="underline text-primary" href="/">thử lại</a> sau vài phút.</p>
                            </div>
                        </div>
                    </div>
                );
            }
            return <WrappedComponent {...this.$props} v-slots={this.$slots} />;
        },
        setup() {
            const hasError = ref(false);
            const error = ref<Error | null>(null);
            onErrorCaptured((err) => {
                hasError.value = true;
                error.value = err as Error;
                console.error("Error captured in withErrorBoundary:", err);
                return false; // Prevent further propagation
            });
            return { hasError, error, reset: () => { hasError.value = false; error.value = null; } };
        },
    });
}