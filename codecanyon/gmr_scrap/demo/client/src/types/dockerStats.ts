interface IBlkioStats {
  io_merged_recursive: null | any[];
  io_queue_recursive: null | any[];
  io_service_bytes_recursive: {
    major: number;
    minor: number;
    op: string;
    value: number;
  }[];
  io_service_time_recursive: null | any[];
  io_serviced_recursive: null | any[];
  io_time_recursive: null | any[];
  io_wait_time_recursive: null | any[];
  sectors_recursive: null | any[];
}

interface ICpuUsage {
  total_usage: number;
  usage_in_kernelmode: number;
  usage_in_usermode: number;
}

interface IThrottlingData {
  periods: number;
  throttled_periods: number;
  throttled_time: number;
}

interface ICpuStats {
  cpu_usage: ICpuUsage;
  online_cpus: number;
  system_cpu_usage: number;
  throttling_data: IThrottlingData;
}

interface IMemoryStats {
  limit: number;
  stats: {
    active_anon: number;
    active_file: number;
    anon: number;
    anon_thp: number;
    file: number;
    file_dirty: number;
    file_mapped: number;
    file_writeback: number;
    inactive_anon: number;
    inactive_file: number;
    kernel_stack: number;
    pgactivate: number;
    pgdeactivate: number;
    pgfault: number;
    pglazyfree: number;
    pglazyfreed: number;
    pgmajfault: number;
    pgrefill: number;
    pgscan: number;
    pgsteal: number;
    shmem: number;
    slab: number;
    slab_reclaimable: number;
    slab_unreclaimable: number;
    sock: number;
    thp_collapse_alloc: number;
    thp_fault_alloc: number;
    unevictable: number;
    workingset_activate: number;
    workingset_nodereclaim: number;
    workingset_refault: number;
  };
  usage: number;
}

interface INetworkStats {
  rx_bytes: number;
  rx_dropped: number;
  rx_errors: number;
  rx_packets: number;
  tx_bytes: number;
  tx_dropped: number;
  tx_errors: number;
  tx_packets: number;
}

interface INetworks {
  eth0: INetworkStats;
}

interface IPidsStats {
  current: number;
  limit: number;
}

interface IPreCpuStats {
  cpu_usage: ICpuUsage;
  online_cpus: number;
  system_cpu_usage: number;
  throttling_data: IThrottlingData;
}

export interface IDockerStats {
  blkio_stats: IBlkioStats;
  cpu_stats: ICpuStats;
  id: string;
  memory_stats: IMemoryStats;
  name: string;
  networks: INetworks;
  num_procs: number;
  pids_stats: IPidsStats;
  precpu_stats: IPreCpuStats;
  preread: string;
  read: string;
  storage_stats: Record<string, any>;
  updatedAt: string;
}
