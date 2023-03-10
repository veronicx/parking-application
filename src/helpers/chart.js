export const options = {
  responsive: true,
  maintainAspectRatio: false,
  backgroundColor: '#7F7F7F',
  defaultFontColor: 'white',
  scales: {
    x: {
      ticks: {
        min: 1,
        callback: function(value, index, values) {
          if (value === 0) {
            return null;
          }
          return value;
        }
      },
      grid: {
        display: false
      },

    },
    y: {
      ticks: {
        min: 1,
        callback: function(value, index, values) {
          if (value === 0) {
            return null;
          }
          return value;
        }
      },
      grid: {
        display: false
      }
    }
  },
  plugins: {
    datalabels: {
       display: function(context) {
          return context.dataset.data[context.dataIndex] !== 0; // or >= 1 or ...
       }
    }
  }
}

  const generateDailyLabels =  () => {
  const date = new Date();
  const labels = []
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  for(let i=1;i< days;i++) {
    labels.push(i)
  }
  return labels
}



const generateYearlyLabels =  () => {
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December']
}

const generateWeeklyLabels = () => {
  return [1,2,3,4,5,6,7]
}

export const generateLabels = (type) => {
    switch(type) {
      case 'yearly':
        return generateYearlyLabels();
        break;
      case 'monthly':
        return generateDailyLabels();
        break;
      case 'weekly':
        return generateWeeklyLabels();
        break;
    }
}

// export const generateAsyncData = async(type,space) => {
//   if()
//
// }

