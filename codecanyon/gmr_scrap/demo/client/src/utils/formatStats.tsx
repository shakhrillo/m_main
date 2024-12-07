export function formatStats(stats: any) {
  if (
    !stats ||
    !stats.id ||
    !stats.name ||
    !stats.cpu_stats ||
    !stats.memory_stats ||
    !stats.networks ||
    !stats.pids_stats
  ) {
    return "Invalid stats object"
  }
  const formatBytes = (bytes: number) => {
    if (bytes === 0 || bytes === undefined || bytes === null || isNaN(bytes))
      return "0 B"

    const units = ["B", "KB", "MB", "GB", "TB"]
    let i = 0
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024
      i++
    }
    return `${bytes.toFixed(2)} ${units[i]}`
  }

  const formatTime = (nanoseconds: number) => {
    const seconds = nanoseconds / 1e9
    const minutes = Math.floor(seconds / 60)
    const hrs = Math.floor(minutes / 60)
    const secs = Math.floor(seconds % 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}m ${secs}s` : `${mins}m ${secs}s`
  }

  function calculateCpuUsage(stats: any) {
    const deltaTotalUsage =
      stats.cpu_stats.cpu_usage.total_usage -
      stats.precpu_stats.cpu_usage.total_usage
    const deltaSystemUsage =
      stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage
    const onlineCpus = stats.cpu_stats.online_cpus || 1 // Default to 1 CPU if not specified

    // Avoid division by zero
    if (deltaSystemUsage > 0) {
      const cpuPercentage =
        (deltaTotalUsage / deltaSystemUsage) * onlineCpus * 100
      return cpuPercentage.toFixed(2) + "%"
    }
    return "0.00%"
  }

  const result = {
    containerId: stats.id,
    name: stats.name,
    cpuUsage: {
      percent: calculateCpuUsage(stats),
      total: formatTime(stats.cpu_stats.cpu_usage.total_usage),
      kernel: formatTime(stats.cpu_stats.cpu_usage.usage_in_kernelmode),
      user: formatTime(stats.cpu_stats.cpu_usage.usage_in_usermode),
    },
    memoryUsage: {
      current: formatBytes(stats.memory_stats.usage),
      limit: formatBytes(stats.memory_stats.limit),
      percent: `${(
        (stats.memory_stats.usage / stats.memory_stats.limit) *
        100
      ).toFixed(2)}%`,
    },
    network: {
      received: formatBytes(stats.networks.eth0.rx_bytes),
      transmitted: formatBytes(stats.networks.eth0.tx_bytes),
    },
    processes: {
      current: stats.pids_stats.current,
      limit:
        stats.pids_stats.limit === 18446744073709552000
          ? "Unlimited"
          : stats.pids_stats.limit,
    },
  }

  return `CPU Usage: ${result.cpuUsage.percent} | Memory Usage: ${result.memoryUsage.current} | Network: ${result.network.received} | Processes: ${result.processes.current}`
}
