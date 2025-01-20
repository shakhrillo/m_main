export interface IDockerConfig {
  Architecture: string;
  BridgeNfIp6tables: boolean;
  BridgeNfIptables: boolean;
  CDISpecDirs: string[];
  CPUSet: boolean;
  CPUShares: boolean;
  CgroupDriver: string;
  CgroupVersion: string;
  Containerd: {
    Address: string;
    Namespaces: Record<string, unknown>;
  };
  ContainerdCommit: {
    ID: string;
    Expected: string;
  };
  Containers: number;
  ContainersPaused: number;
  ContainersRunning: number;
  ContainersStopped: number;
  CpuCfsPeriod: boolean;
  CpuCfsQuota: boolean;
  Debug: boolean;
  DefaultRuntime: string;
  DockerRootDir: string;
  Driver: string;
  DriverStatus: [string, string][];
  ExperimentalBuild: boolean;
  GenericResources: null;
  HttpProxy: string;
  HttpsProxy: string;
  ID: string;
  IPv4Forwarding: boolean;
  Images: number;
  IndexServerAddress: string;
  InitBinary: string;
  InitCommit: {
    ID: string;
    Expected: string;
  };
  Isolation: string;
  KernelVersion: string;
  Labels: string[];
  LiveRestoreEnabled: boolean;
  LoggingDriver: string;
  MemTotal: number;
  MemoryLimit: boolean;
  NCPU: number;
  NEventsListener: number;
  NFd: number;
  NGoroutines: number;
  Name: string;
  NoProxy: string;
  OSType: string;
  OSVersion: string;
  OperatingSystem: string;
  PidsLimit: boolean;
  Plugins: {
    Volume: string[];
    Network: string[];
    Authorization: null;
    Log: string[];
  };
  ProductLicense: string;
  RegistryConfig: {
    AllowNondistributableArtifactsCIDRs: null;
    AllowNondistributableArtifactsHostnames: null;
    InsecureRegistryCIDRs: string[];
    IndexConfigs: Record<string, unknown>;
    Mirrors: null;
  };
  RuncCommit: {
    ID: string;
    Expected: string;
  };
  Runtimes: Record<string, unknown>;
  SecurityOptions: string[];
  ServerVersion: string;
  SwapLimit: boolean;
  Swarm: {
    NodeID: string;
    NodeAddr: string;
    LocalNodeState: string;
    ControlAvailable: boolean;
    Error: string;
  };
  SystemTime: string;
  Warnings: string[];
  id: string;
  type: string;
}
