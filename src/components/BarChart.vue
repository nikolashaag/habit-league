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
    console.log('data is ', this.data)
    this.renderChart(this.data)
  }
}
</script>
