<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.data, this.data.options)
  }
}
</script>
