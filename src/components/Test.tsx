import useSWRV from "@/lib/swr";
import { defineComponent } from "vue";

const test = defineComponent((props, _ctx) => {
  const { data } = useSWRV(
    "https://jsonplaceholder.typicode.com/todos/" + props.jobId
  );
  return () => (
    <div>
      <p>Test Component {props.jobId}</p>
      <pre>{JSON.stringify(data.value)}</pre>
    </div>
  );
}, { name: "TestComponent", props: { jobId: { type: String, required: true } } });
export default test;
