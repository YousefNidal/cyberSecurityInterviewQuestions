const fs = require('fs');
const path = require('path');

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = (arr, n) => shuffle(arr).slice(0, n);

const seen = new Set();
const questions = [];
let idCounter = 0;

function push(q, text) {
  if (!text || seen.has(text)) return;
  seen.add(text);
  idCounter += 1;
  q.id = idCounter;
  questions.push(q);
}

function choiceQ(topic, text, textRu, correct, distractors) {
  const used = new Set();
  const opts = shuffle([correct, ...pick(distractors, 3)]).filter((o) => {
    if (used.has(o.en)) return false;
    used.add(o.en);
    return true;
  });
  const q = {
    topic,
    type: 'choice',
    text,
    text_ru: textRu,
    answer: correct.en,
    options: opts.map((o) => o.en),
  };
  if (correct.ru !== correct.en) q.answer_ru = correct.ru;
  if (opts.some((o) => o.ru !== o.en)) q.options_ru = opts.map((o) => o.ru);
  push(q, text);
}

function textQ(topic, text, textRu, answer, answerRu) {
  const q = { topic, type: 'text', text, text_ru: textRu, answer };
  if (answerRu && answerRu !== answer) q.answer_ru = answerRu;
  push(q, text);
}

const PORTS = [
  ['HTTP', '80', 'TCP'], ['HTTPS', '443', 'TCP'], ['SSH', '22', 'TCP'], ['FTP', '21', 'TCP'],
  ['FTP data', '20', 'TCP'], ['DNS', '53', 'Both'], ['RDP', '3389', 'TCP'], ['SMTP', '25', 'TCP'],
  ['POP3', '110', 'TCP'], ['IMAP', '143', 'TCP'], ['SMB', '445', 'TCP'], ['Telnet', '23', 'TCP'],
  ['LDAP', '389', 'TCP'], ['LDAPS', '636', 'TCP'], ['Kerberos', '88', 'TCP'], ['SNMP', '161', 'UDP'],
  ['NTP', '123', 'UDP'], ['TFTP', '69', 'UDP'], ['MSSQL', '1433', 'TCP'], ['MySQL', '3306', 'TCP'],
  ['PostgreSQL', '5432', 'TCP'], ['Oracle DB', '1521', 'TCP'], ['Redis', '6379', 'TCP'],
  ['MongoDB', '27017', 'TCP'], ['Cassandra', '9042', 'TCP'], ['VNC', '5900', 'TCP'],
  ['RADIUS', '1812', 'UDP'], ['Syslog', '514', 'UDP'], ['NetBIOS name', '137', 'UDP'],
  ['NetBIOS session', '139', 'TCP'], ['Docker daemon', '2375', 'TCP'], ['Elasticsearch', '9200', 'TCP'],
  ['PPTP', '1723', 'TCP'], ['SIP', '5060', 'Both'], ['IMAPS', '993', 'TCP'], ['POP3S', '995', 'TCP'],
  ['SMTPS', '465', 'TCP'], ['WHOIS', '43', 'TCP'], ['IRC', '194', 'TCP'], ['NNTP', '119', 'TCP'],
  ['MS RPC', '135', 'TCP'], ['IKE', '500', 'UDP'], ['Git daemon', '9418', 'TCP'], ['Zabbix agent', '10050', 'TCP'],
  ['Jenkins', '8080', 'TCP'], ['Nagios NRPE', '5666', 'TCP'], ['Grafana', '3000', 'TCP'],
  ['Prometheus', '9090', 'TCP'], ['Kibana', '5601', 'TCP'], ['Rsync', '873', 'TCP'],
  ['NFS', '2049', 'Both'], ['OpenVPN', '1194', 'UDP'], ['Memcached', '11211', 'TCP'],
  ['RabbitMQ', '5672', 'TCP'], ['Kafka', '9092', 'TCP'], ['Zookeeper', '2181', 'TCP'],
  ['The Kubernetes API', '6443', 'TCP'], ['Kubelet', '10250', 'TCP'], ['Minecraft', '25565', 'TCP'],
  ['RDP', '3389', 'TCP'], ['SMTP submission', '587', 'TCP'], ['TACACS', '49', 'TCP'],
];

const ACRONYMS = [
  ['DDoS', 'Distributed Denial of Service', 'Распределённый отказ в обслуживании'],
  ['XSS', 'Cross Site Scripting', 'Межсайтовый скриптинг'],
  ['SQLi', 'SQL Injection', 'SQL-инъекция'],
  ['OSINT', 'Open Source Intelligence', 'Разведка из открытых источников'],
  ['CTF', 'Capture The Flag', 'Захват флага'],
  ['VPN', 'Virtual Private Network', 'Виртуальная частная сеть'],
  ['APT', 'Advanced Persistent Threat', 'Продвинутая устойчивая угроза'],
  ['SIEM', 'Security Information and Event Management', 'Управление информационной безопасностью и событиями'],
  ['IAM', 'Identity and Access Management', 'Управление идентификацией и доступом'],
  ['WAF', 'Web Application Firewall', 'Веб-прикладной межсетевой экран'],
  ['IDS', 'Intrusion Detection System', 'Система обнаружения вторжений'],
  ['IPS', 'Intrusion Prevention System', 'Система предотвращения вторжений'],
  ['DLP', 'Data Loss Prevention', 'Предотвращение утечек данных'],
  ['EDR', 'Endpoint Detection and Response', 'Обнаружение и реагирование на конечных точках'],
  ['XDR', 'Extended Detection and Response', 'Расширенное обнаружение и реагирование'],
  ['MFA', 'Multi-Factor Authentication', 'Многофакторная аутентификация'],
  ['SSO', 'Single Sign-On', 'Единый вход'],
  ['PAM', 'Privileged Access Management', 'Управление привилегированным доступом'],
  ['TOTP', 'Time-based One-Time Password', 'Одноразовый пароль на основе времени'],
  ['SOC', 'Security Operations Center', 'Центр мониторинга безопасности'],
  ['CSRF', 'Cross-Site Request Forgery', 'Межсайтовая подделка запроса'],
  ['RCE', 'Remote Code Execution', 'Удалённое выполнение кода'],
  ['LFI', 'Local File Inclusion', 'Локальное включение файлов'],
  ['RFI', 'Remote File Inclusion', 'Удалённое включение файлов'],
  ['XXE', 'XML External Entity', 'Внешняя XML-сущность'],
  ['SSRF', 'Server-Side Request Forgery', 'Подделка запроса на стороне сервера'],
  ['CVE', 'Common Vulnerabilities and Exposures', 'Общие уязвимости и риски'],
  ['CVSS', 'Common Vulnerability Scoring System', 'Общая система оценки уязвимостей'],
  ['IOC', 'Indicator of Compromise', 'Индикатор компрометации'],
  ['TTP', 'Tactics, Techniques and Procedures', 'Тактики, методы и процедуры'],
  ['GRC', 'Governance, Risk and Compliance', 'Управление, риски и соответствие'],
  ['GDPR', 'General Data Protection Regulation', 'Общий регламент по защите данных'],
  ['HIPAA', 'Health Insurance Portability and Accountability Act', 'Закон о переносимости и подотчётности медстрахования'],
  ['PCI DSS', 'Payment Card Industry Data Security Standard', 'Стандарт безопасности данных платёжных карт'],
  ['NIST', 'National Institute of Standards and Technology', 'Национальный институт стандартов и технологий'],
  ['OWASP', 'Open Worldwide Application Security Project', 'Открытый проект по безопасности веб-приложений'],
  ['BYOD', 'Bring Your Own Device', 'Использование личных устройств'],
  ['CIA', 'Confidentiality, Integrity, Availability', 'Конфиденциальность, целостность и доступность'],
  ['AAA', 'Authentication, Authorization, Accounting', 'Аутентификация, авторизация и учёт'],
  ['NAC', 'Network Access Control', 'Контроль доступа к сети'],
  ['PKI', 'Public Key Infrastructure', 'Инфраструктура открытых ключей'],
  ['HSM', 'Hardware Security Module', 'Аппаратный модуль безопасности'],
  ['CSP', 'Content Security Policy', 'Политика безопасности контента'],
  ['SAML', 'Security Assertion Markup Language', 'Язык разметки Security Assertion'],
  ['OAuth', 'Open Authorization', 'Открытая авторизация'],
  ['RBAC', 'Role-Based Access Control', 'Управление доступом на основе ролей'],
  ['MTTR', 'Mean Time To Recovery', 'Среднее время восстановления'],
  ['MTTD', 'Mean Time To Detect', 'Среднее время обнаружения'],
  ['OSCP', 'Offensive Security Certified Professional', 'Сертифицированный специалист Offensive Security'],
  ['CEH', 'Certified Ethical Hacker', 'Сертифицированный этичный хакер'],
  ['CISSP', 'Certified Information Systems Security Professional', 'Сертифицированный специалист по безопасности информационных систем'],
  ['SAST', 'Static Application Security Testing', 'Статический анализ безопасности приложений'],
  ['DAST', 'Dynamic Application Security Testing', 'Динамический анализ безопасности приложений'],
  ['SOAR', 'Security Orchestration, Automation and Response', 'Оркестрация, автоматизация и реагирование в безопасности'],
  ['TCP', 'Transmission Control Protocol', 'Протокол управления передачей'],
  ['UDP', 'User Datagram Protocol', 'Протокол пользовательских датаграмм'],
  ['ICMP', 'Internet Control Message Protocol', 'Межсетевой протокол управляющих сообщений'],
  ['ARP', 'Address Resolution Protocol', 'Протокол разрешения адресов'],
  ['DHCP', 'Dynamic Host Configuration Protocol', 'Протокол динамической настройки узла'],
  ['SSL', 'Secure Sockets Layer', 'Уровень защищённых сокетов'],
  ['TLS', 'Transport Layer Security', 'Безопасность транспортного уровня'],
  ['MAC', 'Media Access Control', 'Управление доступом к среде'],
  ['NAT', 'Network Address Translation', 'Преобразование сетевых адресов'],
  ['DMZ', 'Demilitarized Zone', 'Демилитаризованная зона'],
  ['VLAN', 'Virtual Local Area Network', 'Виртуальная локальная сеть'],
  ['C2', 'Command and Control', 'Управляющий сервер (C2)'],
  ['JWT', 'JSON Web Token', 'Веб-токен JSON'],
  ['OIDC', 'OpenID Connect', 'Протокол OpenID Connect'],
  ['ABAC', 'Attribute-Based Access Control', 'Управление доступом на основе атрибутов'],
  ['ACL', 'Access Control List', 'Список контроля доступа'],
  ['CASB', 'Cloud Access Security Broker', 'Брокер безопасности облачного доступа'],
  ['ZTNA', 'Zero Trust Network Access', 'Сетевой доступ по модели нулевого доверия'],
  ['FIM', 'File Integrity Monitoring', 'Мониторинг целостности файлов'],
  ['HIDS', 'Host Intrusion Detection System', 'Система обнаружения вторжений на хосте'],
  ['NIDS', 'Network Intrusion Detection System', 'Система обнаружения вторжений в сети'],
  ['DGA', 'Domain Generation Algorithm', 'Алгоритм генерации доменов'],
  ['MITM', 'Man-in-the-Middle', 'Атака «человек посередине»'],
  ['XDR', 'Extended Detection and Response', 'Расширенное обнаружение и реагирование'],
  ['MDR', 'Managed Detection and Response', 'Управляемое обнаружение и реагирование'],
  ['PII', 'Personally Identifiable Information', 'Персональные данные'],
  ['SOC 2', 'System and Organization Controls 2', 'Система и организация контроля 2'],
  ['FUD', 'Fully Undetectable', 'Полностью необнаруживаемый'],
  ['RAT', 'Remote Access Trojan', 'Троян удалённого доступа'],
  ['CVE', 'Common Vulnerabilities and Exposures', 'Общие уязвимости и риски'],
  ['SIEM', 'Security Information and Event Management', 'Управление информационной безопасностью и событиями'],
  ['NGFW', 'Next-Generation Firewall', 'Межсетевой экран нового поколения'],
  ['WPA', 'Wi-Fi Protected Access', 'Защищённый доступ Wi-Fi'],
];

const TOOLS = [
  ['Nmap', 'network scanning', 'сканирования сети'],
  ['Wireshark', 'packet sniffing', 'перехвата трафика'],
  ['Metasploit', 'penetration testing and exploitation', 'тестирования на проникновение и эксплуатации'],
  ['Burp Suite', 'web application security testing', 'тестирования безопасности веб-приложений'],
  ['Hashcat', 'password hash cracking', 'взлома хешей паролей'],
  ['Nessus', 'vulnerability scanning', 'сканирования уязвимостей'],
  ['Gobuster', 'directory and DNS brute-forcing', 'перебора директорий и DNS'],
  ['Stegsolve', 'steganography analysis', 'анализа стеганографии'],
  ['Hydra', 'online password brute-forcing', 'онлайн-перебора паролей'],
  ['John the Ripper', 'offline password cracking', 'офлайн-взлома паролей'],
  ['sqlmap', 'SQL injection testing', 'тестирования на SQL-инъекции'],
  ['Aircrack-ng', 'wireless network cracking', 'взлома беспроводных сетей'],
  ['Sublist3r', 'subdomain enumeration', 'перечисления поддоменов'],
  ['Maltego', 'OSINT data gathering', 'сбора OSINT-данных'],
  ['Ghidra', 'binary reverse engineering', 'реверс-инжиниринга бинарников'],
  ['Volatility', 'memory forensics', 'криминалистики памяти'],
  ['Autopsy', 'disk forensics', 'криминалистики дисков'],
  ['Nikto', 'web server scanning', 'сканирования веб-серверов'],
  ['WPScan', 'WordPress vulnerability scanning', 'сканирования уязвимостей WordPress'],
  ['searchsploit', 'searching for public exploits', 'поиска публичных эксплойтов'],
  ['Responder', 'capturing network credentials', 'перехвата сетевых учётных данных'],
  ['BloodHound', 'Active Directory enumeration', 'перечисления Active Directory'],
  ['Mimikatz', 'credential dumping', 'дампа учётных данных'],
  ['masscan', 'fast port scanning', 'быстрого сканирования портов'],
  ['ffuf', 'web content discovery', 'обнаружения веб-контента'],
  ['Trivy', 'container vulnerability scanning', 'сканирования уязвимостей контейнеров'],
  ['ScoutSuite', 'cloud security assessment', 'оценки безопасности облака'],
  ['OpenVAS', 'vulnerability management', 'управления уязвимостями'],
  ['tcpdump', 'command-line packet capture', 'захвата трафика в консоли'],
  ['Scapy', 'crafting network packets', 'создания сетевых пакетов'],
  ['Amass', 'attack surface mapping', 'картирования поверхности атаки'],
  ['dnsrecon', 'DNS enumeration', 'перечисления DNS'],
  ['enum4linux', 'SMB enumeration', 'перечисления SMB'],
  ['CherryTree', 'taking engagement notes', 'ведения заметок по проекту'],
  ['proxychains', 'routing traffic through proxies', 'маршрутизации трафика через прокси'],
  ['BeEF', 'browser exploitation', 'эксплуатации браузеров'],
  ['Empire', 'post-exploitation', 'пост-эксплуатации'],
  ['Covenant', 'Command and Control operations', 'операций Command and Control'],
  ['Netcat', 'reading and writing data over the network', 'чтения и записи данных по сети'],
  ['hping3', 'crafting custom TCP/IP packets', 'создания произвольных TCP/IP-пакетов'],
  ['Ettercap', 'man-in-the-middle attacks on a LAN', 'атак «человек посередине» в локальной сети'],
  ['Bettercap', 'network attack and monitoring', 'сетевых атак и мониторинга'],
  ['theHarvester', 'collecting emails and subdomains', 'сбора email-адресов и поддоменов'],
  ['recon-ng', 'web reconnaissance', 'веб-разведки'],
  ['Nuclei', 'template-based vulnerability scanning', 'сканирования уязвимостей по шаблонам'],
  ['httpx', 'probing live web hosts', 'проверки доступных веб-хостов'],
  ['subfinder', 'passive subdomain discovery', 'пассивного поиска поддоменов'],
  ['Feroxbuster', 'recursive content discovery', 'рекурсивного поиска контента'],
  ['dirsearch', 'web path brute-forcing', 'перебора путей на веб-сервере'],
  ['OWASP ZAP', 'automated web app scanning', 'автоматизированного сканирования веб-приложений'],
  ['gitleaks', 'detecting secrets in git repositories', 'поиска секретов в git-репозиториях'],
  ['TruffleHog', 'finding leaked credentials in repos', 'поиска утёкших учётных данных в репозиториях'],
  ['Semgrep', 'static code analysis', 'статического анализа кода'],
  ['Ghidra', 'disassembling binaries', 'дизассемблирования бинарников'],
  ['crackmapexec', 'assessing Active Directory networks', 'оценки сетей Active Directory'],
  ['Rubeus', 'Kerberos attack toolkit', 'набора для атак на Kerberos'],
  ['Impacket', 'working with network protocols', 'работы с сетевыми протоколами'],
  ['Chisel', 'tunneling traffic over HTTP', 'туннелирования трафика через HTTP'],
  ['Falco', 'runtime container threat detection', 'обнаружения угроз в контейнерах в реальном времени'],
  ['tfsec', 'scanning Terraform for misconfigurations', 'поиска ошибок конфигурации Terraform'],
];

const COMMANDS = [
  ['scp', 'transfer files over the network', 'передачи файлов по сети'],
  ['ssh', 'establish an encrypted remote session', 'установки шифрованной удалённой сессии'],
  ['nmap', 'scan ports on a remote host', 'сканирования портов на удалённом хосте'],
  ['tcpdump', 'capture network packets', 'захвата сетевых пакетов'],
  ['dig', 'resolve DNS names', 'разрешения DNS-имён'],
  ['netstat', 'list open network connections', 'просмотра открытых сетевых соединений'],
  ['ping', 'test connectivity to a host', 'проверки доступности хоста'],
  ['traceroute', 'trace the network path to a host', 'трассировки маршрута до хоста'],
  ['ps', 'view active processes', 'просмотра активных процессов'],
  ['lsof', 'list open files', 'просмотра открытых файлов'],
  ['chmod', 'change file permissions', 'изменения прав доступа к файлам'],
  ['chown', 'change file ownership', 'изменения владельца файла'],
  ['find', 'search for files on the filesystem', 'поиска файлов в файловой системе'],
  ['grep', 'search for text within files', 'поиска текста в файлах'],
  ['tail', 'view the end of a file', 'просмотра конца файла'],
  ['sha256sum', 'compute a SHA-256 hash of a file', 'вычисления хеша SHA-256 файла'],
  ['curl', 'download a file from a URL', 'загрузки файла по URL'],
  ['wget', 'download files from the web', 'загрузки файлов из интернета'],
  ['iptables', 'manage firewall rules', 'управления правилами брандмауэра'],
  ['journalctl', 'view systemd logs', 'просмотра системных журналов'],
  ['md5sum', 'compute an MD5 checksum', 'вычисления контрольной суммы MD5'],
  ['whois', 'look up domain registration data', 'получения данных о регистрации домена'],
  ['ifconfig', 'view and configure network interfaces', 'просмотра и настройки сетевых интерфейсов'],
  ['useradd', 'create a new user account', 'создания новой учётной записи'],
  ['crontab', 'schedule recurring tasks', 'планирования повторяющихся задач'],
  ['strings', 'extract readable text from a binary', 'извлечения текста из бинарного файла'],
  ['grep', 'search text using patterns', 'поиска текста по шаблонам'],
  ['awk', 'process and analyze text columns', 'обработки и анализа текстовых колонок'],
  ['sed', 'find and replace text in streams', 'поиска и замены текста в потоке'],
  ['cut', 'extract sections from each line', 'извлечения полей из строк'],
  ['sort', 'sort lines of text', 'сортировки строк текста'],
  ['uniq', 'filter repeated lines', 'удаления повторяющихся строк'],
  ['head', 'view the beginning of a file', 'просмотра начала файла'],
  ['wc', 'count lines, words and bytes', 'подсчёта строк, слов и байтов'],
  ['file', 'determine a file type', 'определения типа файла'],
  ['xxd', 'view a file in hexadecimal', 'просмотра файла в шестнадцатеричном виде'],
  ['tar', 'create or extract archives', 'создания и распаковки архивов'],
  ['gzip', 'compress files', 'сжатия файлов'],
  ['base64', 'encode or decode base64 data', 'кодирования и декодирования base64'],
  ['openssl', 'manage certificates and encryption', 'работы с сертификатами и шифрованием'],
  ['nslookup', 'query DNS servers', 'опроса DNS-серверов'],
  ['host', 'perform DNS lookups', 'выполнения DNS-запросов'],
  ['arp', 'view and modify the ARP cache', 'просмотра и изменения ARP-кэша'],
  ['route', 'view and edit the routing table', 'просмотра и изменения таблицы маршрутизации'],
  ['ss', 'inspect network sockets', 'просмотра сетевых сокетов'],
  ['passwd', 'change a user password', 'смены пароля пользователя'],
  ['su', 'switch user accounts', 'переключения между пользователями'],
  ['sudo', 'run commands as another user', 'выполнения команд от имени другого пользователя'],
];

const OSI_LAYERS = {
  1: ['Physical', 'Физический'],
  2: ['Data Link', 'Канальный'],
  3: ['Network', 'Сетевой'],
  4: ['Transport', 'Транспортный'],
  5: ['Session', 'Сеансовый'],
  6: ['Presentation', 'Уровень представления'],
  7: ['Application', 'Прикладной'],
};

const PROTOCOLS = [
  ['HTTP', 'transferring web content', 'передачи веб-контента', 'TCP', 7],
  ['HTTPS', 'encrypted web traffic', 'шифрованной веб-передачи', 'TCP', 7],
  ['DNS', 'resolving domain names to IP addresses', 'преобразования доменных имён в IP-адреса', 'Both', 7],
  ['DHCP', 'dynamically assigning IP addresses', 'динамического назначения IP-адресов', 'UDP', 7],
  ['SMTP', 'sending email', 'отправки электронной почты', 'TCP', 7],
  ['POP3', 'retrieving email', 'получения электронной почты', 'TCP', 7],
  ['IMAP', 'accessing email stored on the server', 'доступа к почте, хранящейся на сервере', 'TCP', 7],
  ['FTP', 'transferring files', 'передачи файлов', 'TCP', 7],
  ['SSH', 'secure remote administration', 'безопасного удалённого администрирования', 'TCP', 7],
  ['Telnet', 'insecure remote login', 'небезопасного удалённого входа', 'TCP', 7],
  ['SNMP', 'managing network devices', 'управления сетевыми устройствами', 'UDP', 7],
  ['LDAP', 'accessing directory services', 'доступа к службам каталогов', 'TCP', 7],
  ['NTP', 'synchronizing clocks', 'синхронизации часов', 'UDP', 7],
  ['RDP', 'remote desktop access', 'удалённого доступа к рабочему столу', 'TCP', 7],
  ['SMB', 'sharing files and printers', 'обмена файлами и принтерами', 'TCP', 7],
  ['Kerberos', 'strong network authentication', 'надёжной сетевой аутентификации', 'TCP', 7],
  ['TFTP', 'simple file transfer', 'простого обмена файлами', 'UDP', 7],
  ['SIP', 'establishing voice and video sessions', 'установления голосовых и видеосессий', 'Both', 7],
  ['RTSP', 'controlling streaming media', 'управления потоковым медиа', 'TCP', 7],
  ['MQTT', 'lightweight IoT messaging', 'обмена сообщениями в IoT', 'TCP', 7],
  ['AMQP', 'reliable message queuing', 'надёжной очереди сообщений', 'TCP', 7],
  ['TCP', 'reliable, connection-oriented delivery', 'надёжной доставки с установкой соединения', 'TCP', 4],
  ['UDP', 'fast, connectionless delivery', 'быстрой доставки без установки соединения', 'UDP', 4],
  ['IP', 'addressing and routing packets', 'адресации и маршрутизации пакетов', 'Both', 3],
  ['ICMP', 'diagnostics and error reporting', 'диагностики и сообщений об ошибках', 'Both', 3],
  ['ARP', 'mapping IP addresses to MAC addresses', 'сопоставления IP- и MAC-адресов', 'Both', 2],
  ['Ethernet', 'framing on the local network segment', 'формирования кадров в локальном сегменте', 'Both', 2],
  ['IPsec', 'securing IP communications', 'защиты IP-коммуникаций', 'Both', 3],
  ['TLS', 'encrypting application-layer traffic', 'шифрования трафика прикладного уровня', 'TCP', 6],
  ['PPTP', 'establishing VPN tunnels', 'создания VPN-туннелей', 'TCP', 3],
  ['L2TP', 'tunneling for VPN connections', 'туннелирования для VPN-соединений', 'UDP', 3],
  ['OpenVPN', 'creating secure VPN tunnels', 'создания защищённых VPN-туннелей', 'Both', 7],
  ['SSH', 'tunneling traffic securely', 'безопасного туннелирования трафика', 'TCP', 4],
  ['TCP', 'flow control and retransmission', 'управления потоком и повторной передачи', 'TCP', 4],
  ['NFS', 'sharing files over a network', 'общего доступа к файлам по сети', 'Both', 7],
  ['GRE', 'encapsulating arbitrary network protocols', 'инкапсуляции произвольных сетевых протоколов', 'Both', 3],
  ['BGP', 'exchanging routing information between ASes', 'обмена маршрутной информацией между AS', 'TCP', 3],
  ['OSPF', 'routing within a single autonomous system', 'маршрутизации внутри одной автономной системы', 'Both', 3],
  ['RIP', 'distance-vector routing', 'дистанционно-векторной маршрутизации', 'UDP', 3],
  ['IGMP', 'managing multicast group membership', 'управления членством в multicast-группах', 'Both', 3],
  ['SFTP', 'secure file transfer over SSH', 'безопасной передачи файлов через SSH', 'TCP', 7],
  ['FTPS', 'file transfer secured with TLS', 'передачи файлов, защищённой TLS', 'TCP', 7],
  ['POP3S', 'secured email retrieval', 'защищённого получения почты', 'TCP', 7],
  ['XMPP', 'real-time messaging', 'обмена сообщениями в реальном времени', 'TCP', 7],
  ['NNTP', 'reading and posting Usenet articles', 'чтения и публикации статей Usenet', 'TCP', 7],
  ['Gopher', 'retrieving organized documents', 'получения структурированных документов', 'TCP', 7],
  ['CoAP', 'constrained IoT communication', 'связи в ограниченных IoT-устройствах', 'UDP', 7],
  ['QUIC', 'low-latency encrypted transport', 'низколатентного шифрованного транспорта', 'UDP', 6],
  ['WebSocket', 'full-duplex browser communication', 'полнодуплексной связи в браузере', 'TCP', 7],
];

const ATTACK_CATEGORIES = {
  dos: { en: 'Denial of Service', ru: 'Отказ в обслуживании' },
  social: { en: 'Social Engineering', ru: 'Социальная инженерия' },
  web: { en: 'Web Application', ru: 'Атаки на веб-приложения' },
  network: { en: 'Network', ru: 'Сетевые атаки' },
  auth: { en: 'Authentication', ru: 'Атаки на аутентификацию' },
  crypto: { en: 'Cryptographic', ru: 'Криптографические атаки' },
  supply: { en: 'Supply Chain', ru: 'Атаки на цепочку поставок' },
  wireless: { en: 'Wireless', ru: 'Атаки на беспроводные сети' },
  malware: { en: 'Malware-based', ru: 'Атаки на основе вредоносного ПО' },
  physical: { en: 'Physical', ru: 'Физические атаки' },
  general: { en: 'General', ru: 'Общие' },
};

const ATTACKS = [
  ['Distributed Denial of Service (DDoS)', 'Распределённый отказ в обслуживании (DDoS)', 'overloading a service with traffic from many sources', 'перегрузку сервиса трафиком из множества источников', 'dos', 'overwhelm a service until it becomes unavailable', 'перегрузить сервис, пока он не станет недоступным'],
  ['Phishing', 'Фишинг', 'tricking users into revealing credentials via fake messages', 'обман пользователей для выдачи учётных данных через поддельные сообщения', 'social', 'deceive users into disclosing sensitive information', 'обманом заставить пользователей раскрыть конфиденциальную информацию'],
  ['Spear Phishing', 'Целевой фишинг', 'sending tailored fake messages to specific individuals', 'отправку персонализированных поддельных сообщений конкретным людям', 'social', 'compromise a specific target with a personalized lure', 'скомпрометировать конкретную цель персонализированной приманкой'],
  ['Whaling', 'Китовая атака (Whaling)', 'targeting senior executives with phishing messages', 'нацеливание на топ-менеджеров фишинговыми сообщениями', 'social', 'compromise high-value executives', 'скомпрометировать руководителей высокого уровня'],
  ['Vishing', 'Голосовой фишинг (Vishing)', 'using phone calls to trick victims into revealing information', 'обман жертв по телефону для получения информации', 'social', 'extract information from victims over the phone', 'выманить информацию у жертвы по телефону'],
  ['Smishing', 'SMS-фишинг (Smishing)', 'using text messages to trick victims into clicking links', 'обман жертв через SMS со ссылками', 'social', 'lure victims through malicious text messages', 'заманить жертву через вредоносные SMS-сообщения'],
  ['Pretexting', 'Претекстинг', 'inventing a fabricated scenario to obtain information', 'выдумывание сценария для получения информации', 'social', 'manipulate a victim using a fabricated story', 'манипулировать жертвой с помощью выдуманной истории'],
  ['Business Email Compromise (BEC)', 'Компрометация деловой переписки (BEC)', 'impersonating executives to request payments', 'выдачу себя за руководителей для запроса платежей', 'social', 'fraudulently redirect payments via email', 'мошеннически перенаправить платежи через email'],
  ['Social Engineering', 'Социальная инженерия', 'manipulating people into revealing information', 'манипулирование людьми для раскрытия информации', 'social', 'manipulate people into breaking security procedures', 'манипулировать людьми для нарушения процедур безопасности'],
  ['SQL Injection', 'SQL-инъекция', 'injecting malicious SQL statements into input fields', 'внедрение вредоносных SQL-запросов через поля ввода', 'web', 'manipulate a database through untrusted input', 'манипулировать базой данных через недоверенный ввод'],
  ['Cross-Site Scripting (XSS)', 'Межсайтовый скриптинг (XSS)', 'injecting scripts that execute in a victim browser', 'внедрение скриптов, выполняемых в браузере жертвы', 'web', 'run malicious scripts in a victim browser', 'выполнить вредоносные скрипты в браузере жертвы'],
  ['Cross-Site Request Forgery (CSRF)', 'Межсайтовая подделка запроса (CSRF)', 'forcing an authenticated user to perform unwanted actions', 'принуждение авторизованного пользователя к нежелательным действиям', 'web', 'make a logged-in user perform unwanted actions', 'заставить авторизованного пользователя выполнить нежелательные действия'],
  ['Server-Side Request Forgery (SSRF)', 'Подделка запроса на стороне сервера (SSRF)', 'making the server request internal resources', 'заставление сервера обращаться к внутренним ресурсам', 'web', 'make a server access internal or protected resources', 'заставить сервер обратиться к внутренним или защищённым ресурсам'],
  ['XML External Entity (XXE)', 'Внешняя XML-сущность (XXE)', 'exploiting XML parsers to read local files', 'эксплуатацию XML-парсеров для чтения локальных файлов', 'web', 'read local files through an XML parser', 'прочитать локальные файлы через XML-парсер'],
  ['Local File Inclusion (LFI)', 'Локальное включение файлов (LFI)', 'including local files through user-controlled input', 'включение локальных файлов через управляемый пользователем ввод', 'web', 'read or execute local files on the server', 'читать или выполнять локальные файлы на сервере'],
  ['Remote File Inclusion (RFI)', 'Удалённое включение файлов (RFI)', 'including remote files through user-controlled input', 'включение удалённых файлов через управляемый пользователем ввод', 'web', 'execute remotely hosted code on the server', 'выполнить удалённо размещённый код на сервере'],
  ['Directory Traversal', 'Обход каталога (Directory Traversal)', 'accessing files outside the web root using ../ sequences', 'доступ к файлам вне веб-корня с помощью последовательностей ../', 'web', 'access files outside the intended directory', 'получить доступ к файлам вне заданного каталога'],
  ['Command Injection', 'Инъекция команд', 'executing OS commands through unsanitized input', 'выполнение команд ОС через неочищенный ввод', 'web', 'run arbitrary operating system commands', 'выполнить произвольные команды операционной системы'],
  ['Clickjacking', 'Клинджекинг (Clickjacking)', 'tricking users into clicking disguised interface elements', 'обман пользователей для клика по замаскированным элементам', 'web', 'make users click hidden interface elements', 'заставить пользователей нажать скрытые элементы интерфейса'],
  ['Open Redirect', 'Открытое перенаправление', 'redirecting users to attacker-controlled sites', 'перенаправление пользователей на подконтрольные злоумышленнику сайты', 'web', 'redirect users to a malicious site', 'перенаправить пользователей на вредоносный сайт'],
  ['Insecure Deserialization', 'Небезопасная десериализация', 'exploiting unsafe object deserialization', 'эксплуатацию небезопасной десериализации объектов', 'web', 'execute code through malicious serialized data', 'выполнить код через вредоносные сериализованные данные'],
  ['Race Condition', 'Состояние гонки (Race Condition)', 'exploiting timing between concurrent operations', 'эксплуатацию временных окон между параллельными операциями', 'web', 'abuse timing to bypass security controls', 'использовать состояние гонки для обхода средств защиты'],
  ['Man-in-the-Middle', 'Атака «человек посередине»', 'intercepting communication between two parties', 'перехват связи между двумя сторонами', 'network', 'secretly relay and alter traffic between two parties', 'тайно передавать и изменять трафик между двумя сторонами'],
  ['ARP Spoofing', 'ARP-спуфинг', 'sending forged ARP replies to link an attacker MAC with a victim IP', 'отправку поддельных ARP-ответов для связывания MAC атакующего с IP жертвы', 'network', 'redirect local network traffic through the attacker', 'перенаправить локальный трафик через атакующего'],
  ['DNS Spoofing', 'Подмена DNS', 'poisoning DNS records to redirect traffic', 'отравление DNS-записей для перенаправления трафика', 'network', 'redirect users to a malicious destination', 'перенаправить пользователей на вредоносный ресурс'],
  ['MAC Flooding', 'Переполнение таблицы MAC', 'flooding a switch with fake MAC addresses', 'заваливание коммутатора поддельными MAC-адресами', 'network', 'overflow a switch MAC table to sniff traffic', 'переполнить таблицу MAC коммутатора для перехвата трафика'],
  ['VLAN Hopping', 'Прыжки между VLAN (VLAN Hopping)', 'abusing trunking to reach other VLANs', 'злоупотребление транкингом для доступа к другим VLAN', 'network', 'access traffic from other VLANs', 'получить доступ к трафику других VLAN'],
  ['DNS Tunneling', 'DNS-туннелирование', 'hiding data inside DNS queries', 'сокрытие данных внутри DNS-запросов', 'network', 'exfiltrate data through DNS traffic', 'вывести данные через DNS-трафик'],
  ['Eavesdropping', 'Прослушивание трафика', 'passively intercepting communications', 'пассивный перехват коммуникаций', 'network', 'secretly listen to network communications', 'тайно прослушивать сетевые коммуникации'],
  ['Lateral Movement', 'Боковое перемещение', 'moving between hosts inside a network after initial access', 'перемещение между хостами внутри сети после первичного доступа', 'network', 'expand access across an internal network', 'расширить доступ по внутренней сети'],
  ['Session Hijacking', 'Перехват сессии', 'using stolen session cookies', 'использование украденных сессионных cookie', 'auth', 'take over an authenticated user session', 'захватить сессию авторизованного пользователя'],
  ['Session Fixation', 'Фиксация сессии', 'forcing a victim to use an attacker-known session ID', 'навязывание жертве известного атакующему идентификатора сессии', 'auth', 'trick a user into using a known session identifier', 'заставить пользователя использовать известный идентификатор сессии'],
  ['Credential Stuffing', 'Подстановка учётных данных (Credential Stuffing)', 'reusing leaked credentials across many sites', 'перебор утёкших учётных данных на множестве сайтов', 'auth', 'log in using credentials leaked from other breaches', 'войти, используя учётные данные из других утечек'],
  ['Brute Force', 'Перебор (Brute Force)', 'guessing passwords by trying many combinations', 'подбор паролей перебором множества комбинаций', 'auth', 'guess a password by trying many combinations', 'подобрать пароль перебором множества комбинаций'],
  ['Password Spraying', 'Распыление паролей (Password Spraying)', 'trying a few common passwords across many accounts', 'пробу немногих распространённых паролей по многим учётным записям', 'auth', 'avoid lockouts while guessing common passwords', 'избежать блокировок, подбирая распространённые пароли'],
  ['Pass-the-Hash', 'Pass-the-Hash', 'authenticating with stolen password hashes', 'аутентификацию с использованием украденных хешей паролей', 'auth', 'authenticate without cracking the underlying password', 'аутентифицироваться без взлома самого пароля'],
  ['Kerberoasting', 'Kerberoasting', 'requesting service tickets to crack service account passwords', 'запрос сервисных билетов для взлома паролей сервисных учётных записей', 'auth', 'extract and crack Kerberos service tickets', 'извлечь и взломать сервисные билеты Kerberos'],
  ['Golden Ticket', 'Golden Ticket', 'forging Kerberos ticket-granting tickets', 'подделку билетов для получения мандата Kerberos', 'auth', 'gain persistent domain-wide access', 'получить постоянный доступ ко всему домену'],
  ['Privilege Escalation', 'Повышение привилегий', 'escalating privileges on a compromised host', 'повышение привилегий на скомпрометированном хосте', 'auth', 'gain higher privileges on a system', 'получить более высокие привилегии в системе'],
  ['Authentication Bypass', 'Обход аутентификации', 'bypassing an application login with a crafted input', 'обход входа в приложение с помощью специально сформированного ввода', 'auth', 'gain access without valid credentials', 'получить доступ без действующих учётных данных'],
  ['Rainbow Table Attack', 'Атака радужных таблиц', 'using precomputed tables of password hashes', 'использование заранее вычисленных таблиц хешей паролей', 'crypto', 'crack password hashes using precomputed values', 'взломать хеши паролей с помощью заранее вычисленных значений'],
  ['Dictionary Attack', 'Атака по словарю', 'trying words from a wordlist as passwords', 'подбор паролей по словарю', 'crypto', 'guess passwords using a wordlist', 'подобрать пароль с помощью словаря'],
  ['Birthday Attack', 'Атака «дней рождения»', 'exploiting hash collisions', 'эксплуатацию коллизий хеш-функций', 'crypto', 'find two different inputs with the same hash', 'найти два разных входа с одинаковым хешем'],
  ['Downgrade Attack', 'Атака понижения (Downgrade)', 'forcing a weaker protocol version', 'принуждение к более слабой версии протокола', 'crypto', 'force the use of a weaker cipher or protocol', 'заставить использовать более слабый шифр или протокол'],
  ['Replay Attack', 'Атака повторного воспроизведения', 'reusing captured valid messages', 'повторное использование перехваченных корректных сообщений', 'crypto', 'replay captured data to impersonate a user', 'воспроизвести перехваченные данные, выдав себя за пользователя'],
  ['Supply Chain Attack', 'Атака на цепочку поставок', 'gaining access through a trusted third party', 'получение доступа через доверенную третью сторону', 'supply', 'compromise a target through a trusted vendor or dependency', 'скомпрометировать цель через доверенного поставщика или зависимость'],
  ['Watering Hole', 'Атака «водопоя» (Watering Hole)', 'compromising websites frequented by a target group', 'компрометацию сайтов, которые посещает целевая группа', 'supply', 'infect visitors of a commonly used website', 'заразить посетителей часто используемого сайта'],
  ['Typosquatting', 'Тайпсквоттинг', 'registering look-alike domains', 'регистрацию похожих доменных имён', 'supply', 'lure users to fraudulent domains through typos', 'заманить пользователей на поддельные домены через опечатки'],
  ['Evil Twin', 'Двойник точки доступа (Evil Twin)', 'faking a Wi-Fi hotspot to intercept traffic', 'создание поддельной точки доступа Wi-Fi для перехвата трафика', 'wireless', 'intercept traffic via a rogue access point', 'перехватить трафик через подконтрольную точку доступа'],
  ['Deauthentication Attack', 'Атака деаутентификации', 'sending forged deauthentication frames', 'отправку поддельных кадров деаутентификации', 'wireless', 'disconnect clients from a wireless network', 'отключить клиентов от беспроводной сети'],
  ['Ransomware Attack', 'Атака программы-вымогателя', 'encrypting victim files and demanding payment', 'шифрование файлов жертвы с требованием выкупа', 'malware', 'extort money by encrypting victim data', 'вымогать деньги путём шифрования данных жертвы'],
  ['Cryptojacking', 'Криптоджекинг', 'using victim resources to mine cryptocurrency', 'использование ресурсов жертвы для майнинга криптовалюты', 'malware', 'mine cryptocurrency using victim resources', 'майнить криптовалюту за счёт ресурсов жертвы'],
  ['Baiting', 'Бейтинг (приманка)', 'luring victims with infected physical media', 'приманивание жертв заражёнными физическими носителями', 'physical', 'tempt victims into installing malware', 'соблазнить жертву установить вредоносное ПО'],
  ['Shoulder Surfing', 'Подглядывание (Shoulder Surfing)', 'observing a victim entering sensitive data', 'подглядывание за вводом конфиденциальных данных', 'physical', 'observe credentials or data in public', 'подсмотреть учётные данные или информацию в общественном месте'],
  ['Tailgating', 'Проход «за спиной» (Tailgating)', 'following an authorized person into a restricted area', 'проход в охраняемую зону вслед за авторизованным лицом', 'physical', 'enter a restricted area without authorization', 'проникнуть в охраняемую зону без разрешения'],
  ['Zero-Day Exploit', 'Эксплойт нулевого дня', 'exploiting an unknown vulnerability with no patch', 'эксплуатацию неизвестной уязвимости без исправления', 'general', 'exploit a vulnerability before it is patched', 'использовать уязвимость до выпуска исправления'],
  ['Buffer Overflow', 'Переполнение буфера', 'writing more data than a buffer can hold', 'запись данных больше, чем вмещает буфер', 'general', 'overwrite memory to control program execution', 'перезаписать память для управления выполнением программы'],
  ['Data Exfiltration', 'Утечка данных', 'stealing sensitive data out of a network', 'кражу конфиденциальных данных из сети', 'general', 'move stolen data out of a network', 'вынести украденные данные из сети'],
  ['Insider Threat', 'Внутренняя угроза', 'misuse of access by an authorized person', 'злоупотребление доступом авторизованным лицом', 'general', 'abuse legitimate access for malicious purposes', 'злоупотребить легитимным доступом в злонамеренных целях'],
  ['Pharming', 'Фарминг', 'redirecting users to fraudulent websites without their knowledge', 'перенаправление пользователей на мошеннические сайты без их ведома', 'general', 'redirect users to fraudulent sites silently', 'незаметно перенаправить пользователей на мошеннические сайты'],
  ['Code Injection', 'Инъекция кода', 'inserting malicious code into a legitimate process', 'внедрение вредоносного кода в легитимный процесс', 'general', 'execute arbitrary code inside a running process', 'выполнить произвольный код внутри работающего процесса'],
  ['Rootkit Attack', 'Атака с использованием руткита', 'hiding malware deep inside the operating system', 'сокрытие вредоносного ПО глубоко в операционной системе', 'general', 'maintain stealthy persistent access to a system', 'поддерживать скрытый постоянный доступ к системе'],
  ['Smurf Attack', 'Smurf-атака', 'amplifying traffic by abusing broadcast ICMP requests', 'усиление трафика за счёт широковещательных ICMP-запросов', 'network', 'amplify traffic to flood a victim host', 'усилить трафик для перегрузки хоста жертвы'],
  ['Fragmentation Attack', 'Атака фрагментацией', 'sending overlapping malformed packet fragments', 'отправку перекрывающихся некорректных фрагментов пакетов', 'network', 'bypass firewalls using malformed fragments', 'обойти брандмауэры с помощью некорректных фрагментов'],
  ['Slowloris', 'Slowloris', 'holding many half-open connections open at once', 'удержание множества полуоткрытых соединений', 'dos', 'exhaust a web server with very slow requests', 'исчерпать ресурсы веб-сервера медленными запросами'],
  ['SYN Flood', 'SYN-флуд', 'sending many TCP SYN packets without completing the handshake', 'отправку множества TCP SYN-пакетов без завершения рукопожатия', 'dos', 'exhaust a server half-open connection table', 'исчерпать таблицу полуоткрытых соединений сервера'],
  ['XSS Reflected', 'Отражённый XSS', 'reflecting malicious script from a request into the response', 'отражение вредоносного скрипта из запроса в ответ', 'web', 'execute script immediately via a crafted link', 'немедленно выполнить скрипт по специально сформированной ссылке'],
  ['XSS Stored', 'Хранимый XSS', 'persisting malicious script on the server', 'сохранение вредоносного скрипта на сервере', 'web', 'execute script for every visitor of a page', 'выполнять скрипт для каждого посетителя страницы'],
  ['Subdomain Takeover', 'Захват поддомена', 'claiming a dangling DNS record pointing to a service', 'получение висячей DNS-записи, указывающей на сервис', 'web', 'host content on an abandoned subdomain', 'разместить контент на заброшенном поддомене'],
  ['Dependency Confusion', 'Путаница зависимостей', 'tricking package managers into pulling a malicious package', 'обман менеджеров пакетов для загрузки вредоносного пакета', 'supply', 'inject a malicious package into the build pipeline', 'внедрить вредоносный пакет в сборочный конвейер'],
];

const MALWARE = [
  ['encrypts files and demands payment', 'шифрует файлы и требует выкуп', 'Ransomware', 'Программа-вымогатель'],
  ['replicates itself without user interaction', 'самораспространяется без участия пользователя', 'Worm', 'Червь'],
  ['disguises itself as legitimate software', 'маскируется под легитимное ПО', 'Trojan', 'Троян'],
  ['records keystrokes', 'записывает нажатия клавиш', 'Keylogger', 'Кейлоггер'],
  ['secretly provides remote access to an attacker', 'тайно предоставляет удалённый доступ злоумышленнику', 'Backdoor', 'Бэкдор'],
  ['spreads by attaching to other programs', 'распространяется, прикрепляясь к другим программам', 'Virus', 'Вирус'],
  ['displays unwanted advertisements', 'показывает нежелательную рекламу', 'Adware', 'Рекламное ПО'],
  ['collects information without consent', 'собирает информацию без согласия', 'Spyware', 'Шпионское ПО'],
  ['blocks access until a fee is paid', 'блокирует доступ до оплаты', 'Scareware', 'Scareware (пугающее ПО)'],
  ['downloads further malicious payloads', 'загружает дополнительные вредоносные полезные нагрузки', 'Dropper', 'Дроппер'],
  ['hides malicious activity from the OS', 'скрывает вредоносную активность от ОС', 'Rootkit', 'Руткит'],
  ['uses victim resources to mine cryptocurrency', 'использует ресурсы жертвы для майнинга криптовалюты', 'Cryptominer', 'Криптомайнер'],
  ['sends spam from an infected host', 'рассылает спам с заражённого хоста', 'Botnet', 'Ботнет'],
  ['steals banking credentials', 'крадёт банковские учётные данные', 'Banking Trojan', 'Банковский троян'],
  ['propagates through infected USB drives', 'распространяется через заражённые USB-накопители', 'Worm', 'Червь'],
  ['infects the master boot record', 'заражает главную загрузочную запись', 'Bootkit', 'Буткит'],
  ['provides interactive remote shell access', 'предоставляет интерактивный удалённый доступ к оболочке', 'Remote Access Trojan', 'Троян удалённого доступа'],
  ['self-replicates across a network automatically', 'самостоятельно распространяется по сети', 'Network Worm', 'Сетевой червь'],
  ['steals credentials stored in a browser', 'крадёт учётные данные, сохранённые в браузере', 'Infostealer', 'Инфостилер'],
  ['executes only when specific conditions are met', 'выполняется только при определённых условиях', 'Logic Bomb', 'Логическая бомба'],
];

const CRYPTO = {
  symmetric: { en: 'symmetric encryption', ru: 'симметричного шифрования' },
  asymmetric: { en: 'asymmetric encryption', ru: 'асимметричного шифрования' },
  hashing: { en: 'cryptographic hashing', ru: 'криптографического хеширования' },
};

const ALGORITHMS = [
  ['AES', 'symmetric'], ['DES', 'symmetric'], ['3DES', 'symmetric'], ['Blowfish', 'symmetric'],
  ['Twofish', 'symmetric'], ['ChaCha20', 'symmetric'], ['RC4', 'symmetric'], ['IDEA', 'symmetric'],
  ['Camellia', 'symmetric'], ['SEED', 'symmetric'], ['Serpent', 'symmetric'], ['CAST', 'symmetric'],
  ['RSA', 'asymmetric'], ['ECC', 'asymmetric'], ['DSA', 'asymmetric'], ['Diffie-Hellman', 'asymmetric'],
  ['ElGamal', 'asymmetric'], ['EdDSA', 'asymmetric'], ['X25519', 'asymmetric'], ['ECDSA', 'asymmetric'],
  ['ECDH', 'asymmetric'], ['RSA-4096', 'asymmetric'],
  ['SHA-256', 'hashing'], ['SHA-1', 'hashing'], ['SHA-512', 'hashing'], ['MD5', 'hashing'],
  ['bcrypt', 'hashing'], ['Argon2', 'hashing'], ['PBKDF2', 'hashing'], ['RIPEMD-160', 'hashing'],
  ['Whirlpool', 'hashing'], ['BLAKE2', 'hashing'], ['SHA-3', 'hashing'], ['scrypt', 'hashing'],
];

const CIPHER_MODES = [
  ['ECB', 'encrypts identical blocks into identical ciphertext', 'шифрует одинаковые блоки в одинаковый шифротекст'],
  ['CBC', 'chains each block with the previous ciphertext', 'связывает каждый блок с предыдущим шифротекстом'],
  ['CTR', 'turns a block cipher into a stream cipher with a counter', 'превращает блочный шифр в потоковый с помощью счётчика'],
  ['GCM', 'provides authenticated encryption', 'обеспечивает аутентифицированное шифрование'],
  ['CFB', 'feeds ciphertext back into the cipher', 'подаёт шифротекст обратно в шифр'],
  ['OFB', 'feeds output back into the cipher', 'подаёт выход обратно в шифр'],
  ['CCM', 'combines CTR mode with authentication', 'объединяет режим CTR с аутентификацией'],
  ['XTS', 'is designed for encrypting disk storage', 'предназначен для шифрования дисков'],
];

const HTTP_STATUS = [
  [200, 'OK', 'OK'], [201, 'Created', 'Создано'], [204, 'No Content', 'Нет содержимого'],
  [301, 'Moved Permanently', 'Перемещено навсегда'], [302, 'Found', 'Найдено'],
  [304, 'Not Modified', 'Не изменено'], [400, 'Bad Request', 'Неверный запрос'],
  [401, 'Unauthorized', 'Неавторизовано'], [403, 'Forbidden', 'Доступ запрещён'],
  [404, 'Not Found', 'Не найдено'], [405, 'Method Not Allowed', 'Метод не разрешён'],
  [429, 'Too Many Requests', 'Слишком много запросов'], [500, 'Internal Server Error', 'Внутренняя ошибка сервера'],
  [502, 'Bad Gateway', 'Плохой шлюз'], [503, 'Service Unavailable', 'Сервис недоступен'],
  [504, 'Gateway Timeout', 'Тайм-аут шлюза'],
];

const OSI_FUNCTIONS = [
  ['the physical transmission of raw bits', 'физической передачи битов', 1],
  ['data link functions and MAC addressing', 'функций канального уровня и MAC-адресации', 2],
  ['routing and logical IP addressing', 'маршрутизации и логической IP-адресации', 3],
  ['end-to-end delivery with TCP/UDP', 'доставки между узлами с помощью TCP/UDP', 4],
  ['establishing and managing sessions', 'установки и управления сеансами', 5],
  ['data representation and encryption', 'представления данных и шифрования', 6],
  ['user-facing services such as HTTP', 'пользовательских сервисов, таких как HTTP', 7],
];

const STANDARDS = [
  ['NIST Cybersecurity Framework', 'a voluntary framework of security outcomes and best practices', 'добровольная структура из результатов и лучших практик по безопасности'],
  ['ISO/IEC 27001', 'an international standard for information security management systems', 'международный стандарт систем менеджмента информационной безопасности'],
  ['PCI DSS', 'a standard for protecting payment card data', 'стандарт защиты данных платёжных карт'],
  ['GDPR', 'a European regulation on personal data protection', 'европейский регламент о защите персональных данных'],
  ['HIPAA', 'a US law protecting health information', 'закон США о защите медицинской информации'],
  ['SOC 2', 'an audit report on security controls of a service provider', 'отчёт об аудите средств контроля поставщика услуг'],
  ['CIS Controls', 'a prioritized set of safeguards against common attacks', 'приоритетный набор мер защиты от распространённых атак'],
  ['MITRE ATT&CK', 'a knowledge base of adversary tactics and techniques', 'база знаний о тактиках и техниках злоумышленников'],
  ['OWASP Top 10', 'a list of the most critical web application risks', 'список наиболее критичных рисков веб-приложений'],
  ['NIST SP 800-53', 'a catalog of security and privacy controls for systems', 'каталог средств контроля безопасности и приватности для систем'],
  ['FIPS 140', 'a US standard for cryptographic modules', 'стандарт США для криптографических модулей'],
  ['FedRAMP', 'a US program for authorizing cloud services', 'программа США по авторизации облачных сервисов'],
  ['FISMA', 'a US law on federal information security management', 'закон США об управлении информационной безопасностью'],
  ['CCPA', 'a California law on consumer privacy', 'закон Калифорнии о приватности потребителей'],
  ['SOX', 'a US law on financial reporting and controls', 'закон США о финансовой отчётности и контроле'],
  ['CSA CCM', 'a cloud security control matrix', 'матрица средств контроля облачной безопасности'],
  ['COBIT', 'a framework for IT governance and management', 'структура управления ИТ и ИТ-процессами'],
  ['ITIL', 'a framework of IT service management practices', 'структура практик управления ИТ-услугами'],
  ['GDPR Article 32', 'requires appropriate technical and organizational security measures', 'требует надлежащих технических и организационных мер безопасности'],
  ['NIST Zero Trust', 'an architecture that never trusts and always verifies', 'архитектура «никогда не доверяй, всегда проверяй»'],
  ['CIS Benchmark', 'secure configuration guidelines for systems', 'рекомендации по безопасной настройке систем'],
  ['ISO/IEC 27002', 'a code of practice for information security controls', 'практическое руководство по средствам контроля информационной безопасности'],
  ['CMMC', 'a US certification for defense contractors', 'сертификация США для оборонных подрядчиков'],
  ['CISSP domains', 'eight domains of information security practice', 'восемь доменов практики информационной безопасности'],
  ['Sarbanes-Oxley', 'a law requiring accurate corporate financial disclosure', 'закон о достоверном раскрытии корпоративной финансовой отчётности'],
  ['NIST IR phases', 'four phases from preparation to post-incident activity', 'четыре этапа от подготовки до постанализа'],
  ['OWASP ASVS', 'a standard for verifying web application security', 'стандарт проверки безопасности веб-приложений'],
  ['OWASP SAMM', 'a model for assessing software security maturity', 'модель оценки зрелости безопасности ПО'],
  ['CIS Top 18', 'the eighteen critical security controls', 'восемнадцать критичных средств контроля безопасности'],
  ['Basel III', 'banking regulations including operational risk rules', 'банковские правила, включая требования к операционному риску'],
];

const PRINCIPLES = [
  ['least privilege', 'grant the minimum access needed to perform a task', 'предоставлять минимальный доступ, необходимый для выполнения задачи'],
  ['defense in depth', 'use multiple layers of security controls', 'использовать несколько уровней средств защиты'],
  ['separation of duties', 'split critical tasks between multiple people', 'разделять критичные задачи между несколькими людьми'],
  ['need to know', 'give access only to information required for the job', 'давать доступ только к информации, необходимой для работы'],
  ['zero trust', 'never trust and always verify every request', 'никогда не доверять и всегда проверять каждый запрос'],
  ['least common mechanism', 'minimize shared mechanisms between users', 'минимизировать общие механизмы между пользователями'],
  ['fail secure', 'deny access by default when a control fails', 'запрещать доступ по умолчанию при отказе средства защиты'],
  ['complete mediation', 'check every access to every object', 'проверять каждый доступ к каждому объекту'],
  ['open design', 'security should not depend on secrecy of the design', 'безопасность не должна зависеть от секретности дизайна'],
  ['psychological acceptability', 'security must be usable enough that people follow it', 'защита должна быть достаточно удобной, чтобы ей следовали'],
  ['economy of mechanism', 'keep security designs simple and small', 'делать системы защиты простыми и компактными'],
  ['weakest link', 'security is only as strong as its weakest component', 'безопасность не прочнее самого слабого звена'],
  ['attack surface reduction', 'minimize the number of exposed entry points', 'минимизировать количество открытых точек входа'],
  ['least astonishment', 'systems should behave as users expect', 'системы должны вести себя так, как ожидают пользователи'],
  ['risk-based security', 'prioritize controls by reducing the highest risks', 'расставлять приоритеты средств защиты по снижению наибольших рисков'],
  ['data minimization', 'collect and keep only necessary data', 'собирать и хранить только необходимые данные'],
  ['privacy by design', 'build privacy protection into systems from the start', 'закладывать защиту приватности в системы с самого начала'],
  ['secure by default', 'systems should be secure out of the box', 'системы должны быть безопасными сразу после установки'],
  ['assume breach', 'design as though attackers are already inside', 'проектировать так, будто злоумышленник уже внутри'],
  ['visibility', 'you cannot protect what you cannot see', 'нельзя защитить то, что не видно'],
];

const WEBVULNS = [
  ['Broken Access Control', 'users can act outside their intended permissions', 'пользователи могут действовать за пределами своих прав'],
  ['Cryptographic Failures', 'sensitive data is exposed due to weak or missing encryption', 'конфиденциальные данные раскрыты из-за слабого или отсутствующего шифрования'],
  ['Injection', 'untrusted data is interpreted as code or commands', 'недоверенные данные интерпретируются как код или команды'],
  ['Insecure Design', 'flaws in the design rather than the implementation', 'изъяны в дизайне, а не в реализации'],
  ['Security Misconfiguration', 'insecure default or missing hardening settings', 'небезопасные настройки по умолчанию или отсутствие укрепления'],
  ['Vulnerable Components', 'using outdated libraries with known flaws', 'использование устаревших библиотек с известными уязвимостями'],
  ['Identification Failures', 'weak authentication and session management', 'слабая аутентификация и управление сессиями'],
  ['Software Integrity Failures', 'trusting updates and data from untrusted sources', 'доверие обновлениям и данным из ненадёжных источников'],
  ['Logging Failures', 'insufficient logging and monitoring of events', 'недостаточное логирование и мониторинг событий'],
  ['Cross-Site Scripting', 'untrusted scripts run in the user browser', 'выполнение недоверенных скриптов в браузере пользователя'],
  ['SQL Injection', 'attacker input alters database queries', 'ввод атакующего изменяет запросы к базе данных'],
  ['Cross-Site Request Forgery', 'state-changing requests are sent without the user intent', 'запросы, изменяющие состояние, отправляются без намерения пользователя'],
  ['XML External Entity', 'external entities are processed by the XML parser', 'внешние сущности обрабатываются XML-парсером'],
  ['Server-Side Request Forgery', 'the server fetches attacker-chosen URLs', 'сервер загружает выбранные атакующим URL'],
  ['Insecure Direct Object Reference', 'objects are accessed by manipulating identifiers', 'объекты доступны при изменении идентификаторов'],
  ['Unrestricted File Upload', 'malicious files can be uploaded and executed', 'можно загружать и выполнять вредоносные файлы'],
  ['Deserialization Flaw', 'untrusted serialized data is deserialized unsafely', 'недоверенные сериализованные данные обрабатываются небезопасно'],
  ['Path Traversal', 'input can reference files outside the intended folder', 'ввод может ссылаться на файлы вне нужного каталога'],
  ['Parameter Tampering', 'hidden or unchecked parameters are modified', 'скрытые или непроверяемые параметры изменяются'],
  ['Mass Assignment', 'unexpected fields are bound to application objects', 'неожиданные поля привязываются к объектам приложения'],
  ['Open Redirect', 'redirect targets are not validated', 'цели перенаправления не проверяются'],
  ['Clickjacking', 'a page is framed to trick user clicks', 'страница встраивается для обмана кликов пользователя'],
  ['Weak Session IDs', 'session identifiers are predictable', 'идентификаторы сессий предсказуемы'],
  ['Using Components with Known Vulnerabilities', 'old dependencies expose known exploits', 'старые зависимости открывают известные эксплойты'],
  ['Information Disclosure', 'errors or metadata leak sensitive details', 'ошибки или метаданные раскрывают конфиденциальные данные'],
  ['HTTP Parameter Pollution', 'duplicate parameters confuse the application', 'дублирующиеся параметры запутывают приложение'],
  ['Host Header Injection', 'the Host header is trusted without validation', 'заголовку Host доверяют без проверки'],
  ['Cache Poisoning', 'a shared cache stores attacker-controlled responses', 'общий кэш хранит ответы под контролем атакующего'],
  ['Subdomain Takeover', 'a dangling DNS record can be claimed', 'висячую DNS-запись можно занять'],
  ['Debug Interface Exposure', 'debug pages expose internal behavior', 'отладочные страницы раскрывают внутреннюю логику'],
];

const CONCEPTS = [
  ['What are the three components of the CIA triad?', 'Каковы три компонента триады CIA?', 'Confidentiality, Integrity, Availability', 'Конфиденциальность, целостность и доступность'],
  ['What does the principle of least privilege mean?', 'Что означает принцип наименьших привилегий?', 'Users should have only the minimum access needed to do their job', 'Пользователи должны иметь только минимальный доступ, необходимый для работы'],
  ['What is defense in depth?', 'Что такое эшелонированная защита (defense in depth)?', 'Using multiple layers of security controls', 'Использование нескольких уровней средств защиты'],
  ['What is the difference between authentication and authorization?', 'В чём разница между аутентификацией и авторизацией?', 'Authentication verifies identity, authorization determines what a user may do', 'Аутентификация подтверждает личность, авторизация определяет, что пользователю разрешено'],
  ['What is a zero-day vulnerability?', 'Что такое уязвимость нулевого дня?', 'A vulnerability unknown to the vendor with no available patch', 'Уязвимость, неизвестная производителю и без доступного исправления'],
  ['What is risk in information security?', 'Что такое риск в информационной безопасности?', 'The likelihood and impact of a threat exploiting a vulnerability', 'Вероятность и последствия использования уязвимости угрозой'],
  ['What is incident response?', 'Что такое реагирование на инциденты?', 'The process of detecting, containing and recovering from security incidents', 'Процесс обнаружения, локализации и восстановления после инцидентов безопасности'],
  ['What is penetration testing?', 'Что такое тестирование на проникновение?', 'Authorized simulated attacks to find vulnerabilities before attackers do', 'Авторизованные имитационные атаки для поиска уязвимостей раньше злоумышленников'],
  ['What is the purpose of encryption?', 'Какова цель шифрования?', 'To protect the confidentiality of data', 'Защита конфиденциальности данных'],
  ['What is hashing used for?', 'Для чего используется хеширование?', 'To verify data integrity and store passwords securely', 'Проверки целостности данных и безопасного хранения паролей'],
  ['What is a digital signature used for?', 'Для чего используется цифровая подпись?', 'To verify authenticity and integrity of a message', 'Проверки подлинности и целостности сообщения'],
  ['What is multi-factor authentication?', 'Что такое многофакторная аутентификация?', 'Combining two or more different authentication factors', 'Объединение двух или более различных факторов аутентификации'],
  ['What is a firewall?', 'Что такое брандмауэр?', 'A device or software that filters network traffic based on rules', 'Устройство или ПО, фильтрующее сетевой трафик по правилам'],
  ['What is the difference between symmetric and asymmetric encryption?', 'В чём разница между симметричным и асимметричным шифрованием?', 'Symmetric uses one shared key, asymmetric uses a public and private key pair', 'Симметричное использует один общий ключ, асимметричное — пару открытого и закрытого ключей'],
  ['What is the purpose of an IDS?', 'Какова цель системы обнаружения вторжений (IDS)?', 'To detect and alert on suspicious network or host activity', 'Обнаружение подозрительной активности и оповещение о ней'],
  ['What is vulnerability management?', 'Что такое управление уязвимостями?', 'The ongoing process of identifying, prioritizing and remediating vulnerabilities', 'Непрерывный процесс выявления, приоритизации и устранения уязвимостей'],
  ['What is security awareness training?', 'Что такое обучение осведомлённости о безопасности?', 'Educating employees about threats and safe behavior', 'Обучение сотрудников угрозам и безопасному поведению'],
  ['What is the purpose of logging and monitoring?', 'Какова цель логирования и мониторинга?', 'To detect anomalies and support incident investigation', 'Обнаружения аномалий и поддержки расследования инцидентов'],
  ['What is threat modeling?', 'Что такое моделирование угроз?', 'Systematically identifying potential threats and mitigations', 'Систематическое выявление потенциальных угроз и мер защиты'],
  ['What is a SOC used for?', 'Для чего используется SOC?', 'Continuously monitoring, detecting and responding to security events', 'Непрерывного мониторинга, обнаружения и реагирования на события безопасности'],
  ['What is data classification?', 'Что такое классификация данных?', 'Categorizing data based on sensitivity and handling requirements', 'Категоризация данных по чувствительности и требованиям к обращению'],
  ['What is an access control list?', 'Что такое список контроля доступа (ACL)?', 'A list defining which subjects may access which resources', 'Список, определяющий, какие субъекты могут обращаться к каким ресурсам'],
  ['What is the purpose of a DMZ?', 'Какова цель DMZ (демилитаризованной зоны)?', 'To isolate public-facing services from the internal network', 'Изоляция публичных сервисов от внутренней сети'],
  ['What is an attack surface?', 'Что такое поверхность атаки?', 'The sum of all points where an attacker could try to enter a system', 'Совокупность всех точек, через которые злоумышленник может проникнуть в систему'],
  ['What is the difference between a vulnerability and a threat?', 'В чём разница между уязвимостью и угрозой?', 'A vulnerability is a weakness, a threat is what could exploit it', 'Уязвимость — это слабость, угроза — то, что может её использовать'],
  ['What is a security control?', 'Что такое средство защиты (security control)?', 'A safeguard that reduces risk to an asset', 'Мера защиты, снижающая риск для актива'],
  ['What are the three types of security controls?', 'Каковы три типа средств защиты?', 'Preventive, detective and corrective', 'Превентивные, детектирующие и корректирующие'],
  ['What is a vulnerability assessment?', 'Что такое оценка уязвимостей?', 'A systematic review of weaknesses without exploitation', 'Систематический обзор слабых мест без эксплуатации'],
  ['What is a red team?', 'Что такое «красная команда» (red team)?', 'A group that simulates attacks against an organization', 'Группа, имитирующая атаки на организацию'],
  ['What is a blue team?', 'Что такое «синяя команда» (blue team)?', 'A group that defends and monitors systems', 'Группа, которая защищает и мониторит системы'],
  ['What is a purple team?', 'Что такое «фиолетовая команда» (purple team)?', 'A collaboration that improves defenses using red team findings', 'Сотрудничество, улучшающее защиту на основе находок красной команды'],
  ['What is the MITRE ATT&CK framework?', 'Что такое фреймворк MITRE ATT&CK?', 'A knowledge base of adversary tactics and techniques', 'База знаний о тактиках и техниках злоумышленников'],
  ['What is the kill chain?', 'Что такое kill chain (цепочка убийства)?', 'The stages of an intrusion from reconnaissance to actions on objectives', 'Этапы вторжения от разведки до действий по достижению целей'],
  ['What is defense against social engineering?', 'Как защититься от социальной инженерии?', 'Awareness training and verification procedures', 'Обучение осведомлённости и процедуры проверки'],
  ['What is the purpose of a honeypot?', 'Какова цель ханипота?', 'To decoy attackers and gather intelligence about their methods', 'Отвлекать злоумышленников и собирать данные об их методах'],
  ['What is an SOC analyst responsible for?', 'За что отвечает аналитик SOC?', 'Triaging and investigating security alerts', 'Разбор и расследование оповещений безопасности'],
  ['What is a SIEM?', 'Что такое SIEM?', 'A platform that aggregates logs and correlates security events', 'Платформа, агрегирующая журналы и коррелирующая события безопасности'],
  ['What is endpoint security?', 'Что такое защита конечных точек?', 'Protecting devices such as laptops and servers from threats', 'Защита устройств, таких как ноутбуки и серверы, от угроз'],
  ['What is network segmentation?', 'Что такое сегментация сети?', 'Dividing a network into zones to limit lateral movement', 'Разделение сети на зоны для ограничения бокового перемещения'],
  ['What is the principle of zero trust?', 'Что такое принцип нулевого доверия?', 'Never trust by default and always verify every request', 'Не доверять по умолчанию и всегда проверять каждый запрос'],
  ['What is data at rest?', 'Что такое данные в состоянии покоя (data at rest)?', 'Stored data not currently being transmitted', 'Хранимые данные, которые сейчас не передаются'],
  ['What is data in transit?', 'Что такое данные в движении (data in transit)?', 'Data actively moving across a network', 'Данные, активно передающиеся по сети'],
  ['What is key management?', 'Что такое управление ключами?', 'The handling of cryptographic keys through their lifecycle', 'Обращение с криптографическими ключами на протяжении их жизненного цикла'],
  ['What is a certificate authority?', 'Что такое удостоверяющий центр (CA)?', 'An entity that issues and signs digital certificates', 'Организация, выпускающая и подписывающая цифровые сертификаты'],
  ['What is the purpose of a salt in password hashing?', 'Какова цель соли при хешировании паролей?', 'To make identical passwords hash differently', 'Делать хеши одинаковых паролей разными'],
  ['What is a rainbow table?', 'Что такое радужная таблица?', 'A precomputed table for cracking password hashes', 'Заранее вычисленная таблица для взлома хешей паролей'],
  ['What is the difference between hashing and encryption?', 'В чём разница между хешированием и шифрованием?', 'Hashing is one-way, encryption is reversible with a key', 'Хеширование необратимо, шифрование обратимо с помощью ключа'],
  ['What is an exploit?', 'Что такое эксплойт?', 'Code or a technique that takes advantage of a vulnerability', 'Код или метод, использующий уязвимость'],
  ['What is a payload?', 'Что такое полезная нагрузка (payload)?', 'The code that runs after an exploit succeeds', 'Код, выполняемый после успешной эксплуатации'],
  ['What is a CVE?', 'Что такое CVE?', 'A unique identifier for a publicly known vulnerability', 'Уникальный идентификатор публично известной уязвимости'],
  ['What is CVSS used for?', 'Для чего используется CVSS?', 'Scoring the severity of vulnerabilities', 'Оценки серьёзности уязвимостей'],
  ['What is a security patch?', 'Что такое патч безопасности?', 'An update that fixes a known vulnerability', 'Обновление, устраняющее известную уязвимость'],
  ['What is change management?', 'Что такое управление изменениями?', 'A controlled process for modifying systems', 'Контролируемый процесс изменения систем'],
  ['What is a business continuity plan?', 'Что такое план обеспечения непрерывности бизнеса?', 'Procedures to keep operations running during disruption', 'Процедуры поддержания работы во время сбоев'],
  ['What is disaster recovery?', 'Что такое восстановление после катастроф?', 'Restoring systems and data after a major failure', 'Восстановление систем и данных после крупного сбоя'],
  ['What is a backup strategy based on?', 'На чём основана стратегия резервного копирования?', 'The 3-2-1 rule of copies and locations', 'Правило 3-2-1 о копиях и местах хранения'],
  ['What is the 3-2-1 backup rule?', 'Что такое правило резервного копирования 3-2-1?', 'Three copies, on two media, with one offsite', 'Три копии, на двух носителях, одна вне площадки'],
  ['What is access review?', 'Что такое аудит доступов?', 'Periodically verifying who still needs each access', 'Периодическая проверка, кому ещё нужен доступ'],
  ['What is segregation of duties?', 'Что такое разделение обязанностей?', 'Ensuring no single person controls a critical process', 'Обеспечение того, что критичный процесс не контролирует один человек'],
  ['What is a security policy?', 'Что такое политика безопасности?', 'A formal statement of rules and responsibilities', 'Формальное изложение правил и обязанностей'],
  ['What is an acceptable use policy?', 'Что такое политика допустимого использования?', 'Rules about how company resources may be used', 'Правила использования ресурсов компании'],
  ['What is an incident?', 'Что такое инцидент?', 'An event that actually or potentially harms security', 'Событие, которое фактически или потенциально вредит безопасности'],
  ['What is the chain of custody?', 'Что такое цепочка сохранности доказательств?', 'Documented handling of evidence to keep it admissible', 'Документированное обращение с доказательствами для их допустимости'],
  ['What is digital forensics?', 'Что такое цифровая криминалистика?', 'Collecting and analyzing digital evidence', 'Сбор и анализ цифровых доказательств'],
  ['What is a memory dump used for?', 'Для чего используется дамп памяти?', 'Analyzing volatile data for evidence of compromise', 'Анализ оперативных данных на признаки компрометации'],
  ['What is threat intelligence?', 'Что такое разведка угроз?', 'Evidence-based knowledge about existing or emerging threats', 'Знания об угрозах на основе доказательств'],
  ['What is an indicator of compromise?', 'Что такое индикатор компрометации?', 'A signal that a system may have been breached', 'Признак возможного взлома системы'],
  ['What is a false positive?', 'Что такое ложное срабатывание?', 'An alert for activity that is actually benign', 'Оповещение о фактически безвредной активности'],
  ['What is a false negative?', 'Что такое пропуск (false negative)?', 'A real threat that is not detected', 'Реальная угроза, которая не обнаружена'],
  ['What is mean time to detect?', 'Что такое среднее время обнаружения?', 'The average time to notice an incident', 'Среднее время до обнаружения инцидента'],
  ['What is mean time to respond?', 'Что такое среднее время реагирования?', 'The average time to contain and resolve an incident', 'Среднее время локализации и устранения инцидента'],
  ['What is the purpose of network monitoring?', 'Какова цель мониторинга сети?', 'To detect anomalies and suspicious traffic early', 'Раннее обнаружение аномалий и подозрительного трафика'],
  ['What is an intrusion prevention system?', 'Что такое система предотвращения вторжений?', 'A control that blocks detected malicious activity', 'Средство, блокирующее обнаруженную вредоносную активность'],
  ['What is application allowlisting?', 'Что такое белый список приложений?', 'Allowing only approved software to run', 'Разрешение запуска только одобренного ПО'],
  ['What is endpoint detection and response?', 'Что такое EDR?', 'Continuous monitoring and response on endpoints', 'Непрерывный мониторинг и реагирование на конечных точках'],
  ['What is privileged access management?', 'Что такое PAM?', 'Controlling and auditing the use of privileged accounts', 'Контроль и аудит использования привилегированных учётных записей'],
  ['What is just-in-time access?', 'Что такое доступ по требованию (JIT)?', 'Granting privileges only when needed and briefly', 'Предоставление привилегий только по необходимости и ненадолго'],
  ['What is a bastion host?', 'Что такое бастион-хост?', 'A hardened host used to access internal systems', 'Укреплённый хост для доступа к внутренним системам'],
  ['What is a jump server?', 'Что такое jump-сервер?', 'An intermediary host for administrative access', 'Промежуточный хост для административного доступа'],
  ['What is network access control?', 'Что такое контроль доступа к сети?', 'Enforcing policy on devices before they join a network', 'Применение политик к устройствам до подключения к сети'],
  ['What is the purpose of a VPN?', 'Какова цель VPN?', 'To create an encrypted tunnel over an untrusted network', 'Создание шифрованного туннеля через недоверенную сеть'],
  ['What is split tunneling?', 'Что такое раздельное туннелирование?', 'Routing only some traffic through the VPN', 'Направление только части трафика через VPN'],
  ['What is a man-in-the-middle risk?', 'В чём риск атаки «человек посередине»?', 'An attacker silently intercepting communications', 'Злоумышленник незаметно перехватывает обмен данными'],
  ['What is certificate pinning?', 'Что такое привязка сертификатов?', 'Trusting only a specific certificate for a service', 'Доверие только конкретному сертификату сервиса'],
  ['What is HSTS?', 'Что такое HSTS?', 'A policy forcing browsers to use HTTPS', 'Политика, заставляющая браузеры использовать HTTPS'],
  ['What is content security policy?', 'Что такое политика безопасности контента?', 'A header that restricts which scripts a page may load', 'Заголовок, ограничивающий загружаемые скрипты страницы'],
  ['What is input validation?', 'Что такое проверка входных данных?', 'Rejecting or sanitizing untrusted input', 'Отклонение или очистка недоверенных данных'],
  ['What is output encoding?', 'Что такое кодирование вывода?', 'Encoding data before rendering it to prevent injection', 'Кодирование данных перед выводом для предотвращения инъекций'],
  ['What is parameterized querying?', 'Что такое параметризованные запросы?', 'Sending SQL with placeholders to prevent injection', 'Отправка SQL с параметрами для защиты от инъекций'],
  ['What is the principle of secure defaults?', 'Что такое принцип безопасных значений по умолчанию?', 'Systems should start in a secure state', 'Системы должны запускаться в безопасном состоянии'],
  ['What is threat hunting?', 'Что такое охота за угрозами?', 'Proactively searching for hidden threats', 'Проактивный поиск скрытых угроз'],
  ['What is a security baseline?', 'Что такое базовый уровень безопасности?', 'A documented secure configuration standard', 'Документированный стандарт безопасной конфигурации'],
  ['What is configuration hardening?', 'Что такое укрепление конфигурации?', 'Removing unnecessary services and tightening settings', 'Удаление лишних служб и ужесточение настроек'],
  ['What is patch management?', 'Что такое управление патчами?', 'Testing and deploying software updates on schedule', 'Тестирование и установка обновлений по расписанию'],
  ['What is asset inventory?', 'Что такое инвентаризация активов?', 'A record of all systems, devices and data', 'Учёт всех систем, устройств и данных'],
  ['What is data retention policy?', 'Что такое политика хранения данных?', 'Rules for how long data is kept and how it is deleted', 'Правила о сроках хранения и удаления данных'],
];

function o(opts) {
  return opts;
}

function buildPorts() {
  const distPorts = PORTS.map((p) => ({ en: p[1], ru: p[1] }));
  PORTS.forEach(([service, port, transport]) => {
    const dp = distPorts.filter((d) => d.en !== port);
    choiceQ('ports', `Which port is typically used for the ${service} service?`, `Какой порт обычно используется для службы ${service}?`, o({ en: port, ru: port }), dp);
    choiceQ('ports', `What is the default port number for ${service}?`, `Каков номер порта по умолчанию для ${service}?`, o({ en: port, ru: port }), dp);
    choiceQ('ports', `On which port does ${service} listen by default?`, `На каком порту по умолчанию слушает ${service}?`, o({ en: port, ru: port }), dp);
    choiceQ('ports', `Which port should usually be open for ${service} to work?`, `Какой порт обычно должен быть открыт для работы ${service}?`, o({ en: port, ru: port }), dp);

    const distServices = PORTS.filter((p) => p[1] !== port).map((p) => ({ en: p[0], ru: p[0] }));
    choiceQ('ports', `Which service uses port ${port} by default?`, `Какая служба по умолчанию использует порт ${port}?`, o({ en: service, ru: service }), distServices);

    const transportOpts = [{ en: 'TCP', ru: 'TCP' }, { en: 'UDP', ru: 'UDP' }, { en: 'Both TCP and UDP', ru: 'И TCP, и UDP' }];
    const correctTransport = transport === 'Both' ? transportOpts[2] : transportOpts.find((x) => x.en === transport);
    choiceQ('ports', `Which transport protocol does ${service} typically use?`, `Какой транспортный протокол обычно использует ${service}?`, correctTransport, transportOpts.filter((x) => x.en !== correctTransport.en));
  });
}

function buildAcronyms() {
  ACRONYMS.forEach(([acro, fullEn, fullRu]) => {
    const dist = ACRONYMS.filter((a) => a[0] !== acro).map((a) => ({ en: a[1], ru: a[2] }));
    choiceQ('general', `What does ${acro} stand for in cyber security?`, `Что означает ${acro} в кибербезопасности?`, o({ en: fullEn, ru: fullRu }), dist);
    choiceQ('general', `Which concept is abbreviated as ${acro}?`, `Какое понятие сокращается как ${acro}?`, o({ en: fullEn, ru: fullRu }), dist);
    choiceQ('general', `The acronym ${acro} is the abbreviation for which term?`, `Аббревиатура ${acro} обозначает какой термин?`, o({ en: fullEn, ru: fullRu }), dist);

    const distAcro = ACRONYMS.filter((a) => a[0] !== acro).map((a) => ({ en: a[0], ru: a[0] }));
    choiceQ('general', `Which acronym stands for "${fullEn}"?`, `Какая аббревиатура обозначает «${fullRu}»?`, o({ en: acro, ru: acro }), distAcro);
  });
}

function buildTools() {
  const distTools = TOOLS.map((t) => ({ en: t[0], ru: t[0] }));
  const distUsages = TOOLS.map((t) => ({ en: t[1], ru: t[2] }));
  TOOLS.forEach(([name, usageEn, usageRu]) => {
    const d = distTools.filter((x) => x.en !== name);
    choiceQ('tools', `Which tool is primarily used for ${usageEn}?`, `Какой инструмент в основном используется для ${usageRu}?`, o({ en: name, ru: name }), d);
    choiceQ('tools', `Which security tool specializes in ${usageEn}?`, `Какой инструмент специализируется на ${usageRu}?`, o({ en: name, ru: name }), d);
    choiceQ('tools', `Which tool would you use for ${usageEn}?`, `Какой инструмент вы бы использовали для ${usageRu}?`, o({ en: name, ru: name }), d);

    const du = distUsages.filter((x) => x.en !== usageEn);
    choiceQ('tools', `What is ${name} primarily used for?`, `Для чего в основном используется ${name}?`, o({ en: usageEn, ru: usageRu }), du);
  });
}

function buildCommands() {
  const distCmd = COMMANDS.map((c) => ({ en: c[0], ru: c[0] }));
  const distPurpose = COMMANDS.map((c) => ({ en: c[1], ru: c[2] }));
  COMMANDS.forEach(([cmd, purposeEn, purposeRu]) => {
    const d = distCmd.filter((x) => x.en !== cmd);
    choiceQ('tools', `Which command is used for ${purposeEn}?`, `Какая команда используется для ${purposeRu}?`, o({ en: cmd, ru: cmd }), d);
    choiceQ('tools', `Which command would you run for ${purposeEn}?`, `Какую команду следует выполнить для ${purposeRu}?`, o({ en: cmd, ru: cmd }), d);

    const dp = distPurpose.filter((x) => x.en !== purposeEn);
    choiceQ('tools', `What is the ${cmd} command used for?`, `Для чего используется команда ${cmd}?`, o({ en: purposeEn, ru: purposeRu }), dp);
  });
}

function buildProtocols() {
  const distNames = PROTOCOLS.map((p) => ({ en: p[0], ru: p[0] }));
  const distPurpose = PROTOCOLS.map((p) => ({ en: p[1], ru: p[2] }));
  PROTOCOLS.forEach(([name, purposeEn, purposeRu, transport, layer]) => {
    const dn = distNames.filter((x) => x.en !== name);
    const dp = distPurpose.filter((x) => x.en !== purposeEn);

    choiceQ('network', `What is the primary purpose of the ${name} protocol?`, `Какова основная цель протокола ${name}?`, o({ en: purposeEn, ru: purposeRu }), dp);
    choiceQ('network', `Which protocol is used for ${purposeEn}?`, `Какой протокол используется для ${purposeRu}?`, o({ en: name, ru: name }), dn);
    choiceQ('network', `At which OSI layer does the ${name} protocol operate?`, `На каком уровне OSI работает протокол ${name}?`, o({ en: `Layer ${layer} - ${OSI_LAYERS[layer][0]}`, ru: `Уровень ${layer} - ${OSI_LAYERS[layer][1]}` }), Object.keys(OSI_LAYERS).filter((l) => Number(l) !== layer).map((l) => ({ en: `Layer ${l} - ${OSI_LAYERS[l][0]}`, ru: `Уровень ${l} - ${OSI_LAYERS[l][1]}` })));

    const transportOpts = [{ en: 'TCP', ru: 'TCP' }, { en: 'UDP', ru: 'UDP' }, { en: 'Both TCP and UDP', ru: 'И TCP, и UDP' }];
    const correct = transport === 'Both' ? transportOpts[2] : transportOpts.find((x) => x.en === transport);
    choiceQ('network', `Which transport protocol does ${name} use?`, `Какой транспортный протокол использует ${name}?`, correct, transportOpts.filter((x) => x.en !== correct.en));
  });
}

function buildAttacks() {
  const distNames = ATTACKS.map((a) => ({ en: a[0], ru: a[1] }));
  const distDesc = ATTACKS.map((a) => ({ en: a[2], ru: a[3] }));
  ATTACKS.forEach(([nameEn, nameRu, descEn, descRu, cat, goalEn, goalRu]) => {
    const dn = distNames.filter((x) => x.en !== nameEn);
    const dd = distDesc.filter((x) => x.en !== descEn);
    const catLabel = ATTACK_CATEGORIES[cat];
    const catDist = Object.entries(ATTACK_CATEGORIES).filter(([k]) => k !== cat).map(([, v]) => ({ en: v.en, ru: v.ru }));

    choiceQ('threats', `Which type of attack involves ${descEn}?`, `Какой тип атаки включает ${descRu}?`, o({ en: nameEn, ru: nameRu }), dn);
    choiceQ('threats', `How is a ${nameEn} attack best described?`, `Как лучше всего описать атаку «${nameRu}»?`, o({ en: descEn, ru: descRu }), dd);
    choiceQ('threats', `Which attack attempts to ${goalEn}?`, `Какая атака пытается ${goalRu}?`, o({ en: nameEn, ru: nameRu }), dn);
    choiceQ('threats', `Which category does the ${nameEn} attack belong to?`, `К какой категории относится атака «${nameRu}»?`, o({ en: catLabel.en, ru: catLabel.ru }), catDist);
    choiceQ('threats', `What is the main goal of a ${nameEn} attack?`, `Какова основная цель атаки «${nameRu}»?`, o({ en: goalEn, ru: goalRu }), ATTACKS.filter((a) => a[5] !== goalEn).map((a) => ({ en: a[5], ru: a[6] })));

    const crossCat = ATTACKS.filter((a) => a[4] !== cat).map((a) => ({ en: a[0], ru: a[1] }));
    choiceQ('threats', `Which of the following is a ${catLabel.en.toLowerCase()} attack?`, `Какая из следующих атак относится к категории «${catLabel.ru}»?`, o({ en: nameEn, ru: nameRu }), crossCat);
  });
}

function buildMalware() {
  const distNames = MALWARE.map((m) => ({ en: m[2], ru: m[3] }));
  const distDesc = MALWARE.map((m) => ({ en: m[0], ru: m[1] }));
  MALWARE.forEach(([descEn, descRu, nameEn, nameRu]) => {
    choiceQ('malware', `Which type of malware ${descEn}?`, `Какой тип вредоносного ПО ${descRu}?`, o({ en: nameEn, ru: nameRu }), distNames.filter((x) => x.en !== nameEn));
    textQ('malware', `What type of malware ${descEn}?`, `Какой тип вредоносного ПО ${descRu}?`, nameEn, nameRu);
    textQ('malware', `A program that ${descEn} is called what?`, `Как называется программа, которая ${descRu}?`, nameEn, nameRu);
    choiceQ('malware', `What does the term "${nameEn}" describe?`, `Что описывает термин «${nameRu}»?`, o({ en: descEn, ru: descRu }), distDesc.filter((x) => x.en !== descEn));
  });
}

function buildCrypto() {
  ALGORITHMS.forEach(([algo, cat]) => {
    const dist = Object.entries(CRYPTO).filter(([k]) => k !== cat).map(([, v]) => ({ en: v.en, ru: v.ru }));
    choiceQ('crypto', `Which category does the ${algo} algorithm belong to?`, `К какой категории относится алгоритм ${algo}?`, o({ en: CRYPTO[cat].en, ru: CRYPTO[cat].ru }), dist);
  });
  choiceQ('crypto', 'Which of the following is a symmetric encryption algorithm?', 'Какой из следующих алгоритмов является симметричным?', o({ en: 'AES', ru: 'AES' }), [{ en: 'RSA', ru: 'RSA' }, { en: 'ECC', ru: 'ECC' }, { en: 'DSA', ru: 'DSA' }]);
  choiceQ('crypto', 'Which of the following is an asymmetric encryption algorithm?', 'Какой из следующих алгоритмов является асимметричным?', o({ en: 'RSA', ru: 'RSA' }), [{ en: 'AES', ru: 'AES' }, { en: 'Blowfish', ru: 'Blowfish' }, { en: 'RC4', ru: 'RC4' }]);
  choiceQ('crypto', 'Which of the following is a cryptographic hash function?', 'Какая из следующих функций является криптографической хеш-функцией?', o({ en: 'SHA-256', ru: 'SHA-256' }), [{ en: 'AES', ru: 'AES' }, { en: 'RSA', ru: 'RSA' }, { en: 'ECC', ru: 'ECC' }]);
  CIPHER_MODES.forEach(([mode, descEn, descRu]) => {
    const dist = CIPHER_MODES.filter((m) => m[0] !== mode).map((m) => ({ en: `Mode ${m[0]}`, ru: `Режим ${m[0]}` }));
    choiceQ('crypto', `Which block cipher mode ${descEn}?`, `Какой режим блочного шифра ${descRu}?`, o({ en: `Mode ${mode}`, ru: `Режим ${mode}` }), dist);
  });
}

function buildHttp() {
  HTTP_STATUS.forEach(([code, meanEn, meanRu]) => {
    const dist = HTTP_STATUS.filter((s) => s[0] !== code).map((s) => ({ en: s[0], ru: s[0] }));
    choiceQ('web', `Which HTTP status code means "${meanEn}"?`, `Какой HTTP-код состояния означает "${meanRu}"?`, o({ en: code, ru: code }), dist);
    textQ('web', `What does the HTTP status code ${code} mean?`, `Что означает HTTP-код состояния ${code}?`, meanEn, meanRu);
  });
}

function buildOsi() {
  Object.entries(OSI_LAYERS).forEach(([num, [en, ru]]) => {
    const fn = OSI_FUNCTIONS.find((f) => f[2] === Number(num));
    const dist = Object.keys(OSI_LAYERS).filter((l) => l !== num).map((l) => ({ en: `Layer ${l} - ${OSI_LAYERS[l][0]}`, ru: `Уровень ${l} - ${OSI_LAYERS[l][1]}` }));
    choiceQ('network', `Which OSI layer is responsible for ${fn[0]}?`, `Какой уровень OSI отвечает за ${fn[1]}?`, o({ en: `Layer ${num} - ${en}`, ru: `Уровень ${num} - ${ru}` }), dist);
    choiceQ('network', `What is the main function of the OSI ${en} layer?`, `Какова основная функция ${ru} уровня OSI?`, o({ en: fn[0], ru: fn[1] }), OSI_FUNCTIONS.filter((f) => f[2] !== Number(num)).map((f) => ({ en: f[0], ru: f[1] })));
  });
}

function buildStandards() {
  const distName = STANDARDS.map((s) => ({ en: s[0], ru: s[0] }));
  const distDesc = STANDARDS.map((s) => ({ en: s[1], ru: s[2] }));
  STANDARDS.forEach(([name, descEn, descRu]) => {
    choiceQ('general', `What is the purpose of ${name}?`, `Какова цель ${name}?`, o({ en: descEn, ru: descRu }), distDesc.filter((x) => x.en !== descEn));
    choiceQ('general', `Which standard or framework is described as ${descEn}?`, `Какой стандарт или фреймворк описывается как ${descRu}?`, o({ en: name, ru: name }), distName.filter((x) => x.en !== name));
  });
}

function buildPrinciples() {
  const distName = PRINCIPLES.map((p) => ({ en: p[0], ru: p[0] }));
  const distDesc = PRINCIPLES.map((p) => ({ en: p[1], ru: p[2] }));
  PRINCIPLES.forEach(([name, descEn, descRu]) => {
    choiceQ('general', `What does the security principle of "${name}" mean?`, `Что означает принцип безопасности «${name}»?`, o({ en: descEn, ru: descRu }), distDesc.filter((x) => x.en !== descEn));
    choiceQ('general', `Which principle means to ${descEn}?`, `Какой принцип означает «${descRu}»?`, o({ en: name, ru: name }), distName.filter((x) => x.en !== name));
  });
}

function buildWebVulns() {
  const distName = WEBVULNS.map((v) => ({ en: v[0], ru: v[0] }));
  const distDesc = WEBVULNS.map((v) => ({ en: v[1], ru: v[2] }));
  WEBVULNS.forEach(([name, descEn, descRu]) => {
    choiceQ('web', `Which web vulnerability is described as ${descEn}?`, `Какая веб-уязвимость описывается как ${descRu}?`, o({ en: name, ru: name }), distName.filter((x) => x.en !== name));
    choiceQ('web', `What is the ${name} vulnerability?`, `Что такое уязвимость ${name}?`, o({ en: descEn, ru: descRu }), distDesc.filter((x) => x.en !== descEn));
  });
}

function buildConcepts() {
  CONCEPTS.forEach(([qEn, qRu, aEn, aRu]) => {
    textQ('general', qEn, qRu, aEn, aRu);
  });
}

buildPorts();
buildAcronyms();
buildTools();
buildCommands();
buildProtocols();
buildAttacks();
buildMalware();
buildCrypto();
buildHttp();
buildOsi();
buildStandards();
buildPrinciples();
buildWebVulns();
buildConcepts();
buildModels();

function buildModels() {
  choiceQ('network', `How many layers are in the OSI model?`, `Сколько уровней в модели OSI?`, { en: `7`, ru: `7` }, [{ en: `4`, ru: `4` }, { en: `5`, ru: `5` }, { en: `6`, ru: `6` }]);
  choiceQ('network', `How many layers are in the TCP/IP model (per RFC 1122)?`, `Сколько уровней в модели TCP/IP (согласно RFC 1122)?`, { en: `4`, ru: `4` }, [{ en: `5`, ru: `5` }, { en: `6`, ru: `6` }, { en: `7`, ru: `7` }]);
  choiceQ('network', `Which networking model was developed first?`, `Какая сетевая модель была разработана раньше?`, { en: `TCP/IP`, ru: `TCP/IP` }, [{ en: `OSI`, ru: `OSI` }, { en: `Both were developed at the same time`, ru: `Обе разработаны одновременно` }, { en: `Neither, they are unrelated`, ru: `Ни одна, они не связаны` }]);
  choiceQ('network', `Which model is a theoretical reference framework rather than a protocol-based model?`, `Какая модель является теоретической эталонной, а не основанной на протоколах?`, { en: `OSI`, ru: `OSI` }, [{ en: `TCP/IP`, ru: `TCP/IP` }, { en: `Both are protocol models`, ru: `Обе являются протокольными моделями` }, { en: `Both are reference models`, ru: `Обе являются эталонными моделями` }]);
  choiceQ('network', `Which model does the Internet actually run on?`, `На какой модели фактически работает Интернет?`, { en: `TCP/IP`, ru: `TCP/IP` }, [{ en: `OSI`, ru: `OSI` }, { en: `Both equally`, ru: `На обеих в равной мере` }, { en: `Neither`, ru: `Ни на одной` }]);
  choiceQ('network', `What does OSI stand for?`, `Как расшифровывается OSI?`, { en: `Open Systems Interconnection`, ru: `Взаимодействие открытых систем` }, [{ en: `Open Source Internet`, ru: `Открытый исходный интернет` }, { en: `Operating System Interface`, ru: `Интерфейс операционной системы` }, { en: `Open Security Integration`, ru: `Интеграция открытой безопасности` }]);
  choiceQ('network', `What does TCP/IP stand for?`, `Как расшифровывается TCP/IP?`, { en: `Transmission Control Protocol / Internet Protocol`, ru: `Протокол управления передачей / Межсетевой протокол` }, [{ en: `Transport Control Program / Internal Protocol`, ru: `Транспортная управляющая программа / внутренний протокол` }, { en: `Total Control Protocol / Integrated Protocol`, ru: `Общий протокол управления / интегрированный протокол` }, { en: `Transfer Connection Program / Internet Program`, ru: `Программа передачи соединений / интернет-программа` }]);
  choiceQ('network', `Which organization developed the OSI model?`, `Какая организация разработала модель OSI?`, { en: `ISO`, ru: `ISO` }, [{ en: `IEEE`, ru: `IEEE` }, { en: `IETF`, ru: `IETF` }, { en: `DARPA`, ru: `DARPA` }]);
  choiceQ('network', `Which agency originally developed the TCP/IP model?`, `Какое агентство изначально разработало модель TCP/IP?`, { en: `DARPA`, ru: `DARPA` }, [{ en: `ISO`, ru: `ISO` }, { en: `IEEE`, ru: `IEEE` }, { en: `W3C`, ru: `W3C` }]);
  choiceQ('network', `Which model is described as a protocol model because it maps directly to real protocols?`, `Какую модель называют протокольной, поскольку она напрямую соответствует реальным протоколам?`, { en: `TCP/IP`, ru: `TCP/IP` }, [{ en: `OSI`, ru: `OSI` }, { en: `Both`, ru: `Обе` }, { en: `Neither`, ru: `Ни одну` }]);
  choiceQ('network', `Which OSI layer is responsible for transmitting raw bits over a physical medium?`, `Какой уровень OSI отвечает за передачу необработанных битов по физической среде?`, { en: `Layer 1 - Physical`, ru: `Уровень 1 - Физический` }, [{ en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `Which OSI layer handles framing and MAC addressing?`, `Какой уровень OSI выполняет формирование кадров и MAC-адресацию?`, { en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, [{ en: `Layer 1 - Physical`, ru: `Уровень 1 - Физический` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `Which OSI layer is responsible for logical addressing and routing?`, `Какой уровень OSI отвечает за логическую адресацию и маршрутизацию?`, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, [{ en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }, { en: `Layer 5 - Session`, ru: `Уровень 5 - Сеансовый` }]);
  choiceQ('network', `Which OSI layer provides reliable end-to-end delivery and flow control?`, `Какой уровень OSI обеспечивает надёжную доставку между узлами и управление потоком?`, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }, [{ en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 5 - Session`, ru: `Уровень 5 - Сеансовый` }, { en: `Layer 6 - Presentation`, ru: `Уровень 6 - Уровень представления` }]);
  choiceQ('network', `Which OSI layer establishes, manages, and terminates sessions?`, `Какой уровень OSI устанавливает, поддерживает и завершает сеансы?`, { en: `Layer 5 - Session`, ru: `Уровень 5 - Сеансовый` }, [{ en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }, { en: `Layer 6 - Presentation`, ru: `Уровень 6 - Уровень представления` }, { en: `Layer 7 - Application`, ru: `Уровень 7 - Прикладной` }]);
  choiceQ('network', `Which OSI layer handles encryption, compression, and data translation?`, `Какой уровень OSI выполняет шифрование, сжатие и преобразование данных?`, { en: `Layer 6 - Presentation`, ru: `Уровень 6 - Уровень представления` }, [{ en: `Layer 5 - Session`, ru: `Уровень 5 - Сеансовый` }, { en: `Layer 7 - Application`, ru: `Уровень 7 - Прикладной` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `Which OSI layer is closest to the end user and includes HTTP, DNS, and SMTP?`, `Какой уровень OSI ближе всего к пользователю и включает HTTP, DNS и SMTP?`, { en: `Layer 7 - Application`, ru: `Уровень 7 - Прикладной` }, [{ en: `Layer 6 - Presentation`, ru: `Уровень 6 - Уровень представления` }, { en: `Layer 5 - Session`, ru: `Уровень 5 - Сеансовый` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `Which OSI layer is directly above the Transport layer?`, `Какой уровень OSI находится непосредственно над транспортным уровнем?`, { en: `Layer 5 - Session`, ru: `Уровень 5 - Сеансовый` }, [{ en: `Layer 6 - Presentation`, ru: `Уровень 6 - Уровень представления` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `Which OSI layer is directly below the Network layer?`, `Какой уровень OSI находится непосредственно под сетевым уровнем?`, { en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, [{ en: `Layer 1 - Physical`, ru: `Уровень 1 - Физический` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }]);
  choiceQ('network', `At which OSI layer does a network switch primarily operate?`, `На каком уровне OSI в основном работает сетевой коммутатор?`, { en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, [{ en: `Layer 1 - Physical`, ru: `Уровень 1 - Физический` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `At which OSI layer does a router primarily operate?`, `На каком уровне OSI в основном работает маршрутизатор?`, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, [{ en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }, { en: `Layer 7 - Application`, ru: `Уровень 7 - Прикладной` }]);
  choiceQ('network', `At which OSI layer does a hub operate?`, `На каком уровне OSI работает концентратор (hub)?`, { en: `Layer 1 - Physical`, ru: `Уровень 1 - Физический` }, [{ en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 7 - Application`, ru: `Уровень 7 - Прикладной` }]);
  choiceQ('network', `At which OSI layer does a web application firewall (WAF) primarily operate?`, `На каком уровне OSI в основном работает брандмауэр веб-приложений (WAF)?`, { en: `Layer 7 - Application`, ru: `Уровень 7 - Прикладной` }, [{ en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `At which OSI layer does a SYN flood attack primarily occur?`, `На каком уровне OSI в основном происходит атака SYN-флуд?`, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }, [{ en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 7 - Application`, ru: `Уровень 7 - Прикладной` }]);
  choiceQ('network', `At which OSI layer does a MAC flooding attack occur?`, `На каком уровне OSI происходит атака MAC-флудинг?`, { en: `Layer 2 - Data Link`, ru: `Уровень 2 - Канальный` }, [{ en: `Layer 1 - Physical`, ru: `Уровень 1 - Физический` }, { en: `Layer 3 - Network`, ru: `Уровень 3 - Сетевой` }, { en: `Layer 4 - Transport`, ru: `Уровень 4 - Транспортный` }]);
  choiceQ('network', `The mnemonic 'Please Do Not Throw Sausage Pizza Away' represents the layers of which model?`, `Мнемоника 'Please Do Not Throw Sausage Pizza Away' обозначает уровни какой модели?`, { en: `OSI model`, ru: `Модель OSI` }, [{ en: `TCP/IP model`, ru: `Модель TCP/IP` }, { en: `CIA triad`, ru: `Триада CIA` }, { en: `Bell-LaPadula model`, ru: `Модель Белла — ЛаПадулы` }]);
  choiceQ('network', `Which mnemonic lists the OSI layers from Layer 7 down to Layer 1?`, `Какая мнемоника перечисляет уровни OSI от 7-го к 1-му?`, { en: `All People Seem To Need Data Processing`, ru: `All People Seem To Need Data Processing` }, [{ en: `Please Do Not Throw Sausage Pizza Away`, ru: `Please Do Not Throw Sausage Pizza Away` }, { en: `Every Good Boy Does Fine`, ru: `Every Good Boy Does Fine` }, { en: `My Very Educated Mother Just Served Us Noodles`, ru: `My Very Educated Mother Just Served Us Noodles` }]);
  choiceQ('network', `Which layer of the TCP/IP model corresponds to the OSI Network layer?`, `Какой уровень модели TCP/IP соответствует сетевому уровню OSI?`, { en: `Internet`, ru: `Межсетевой` }, [{ en: `Transport`, ru: `Транспортный` }, { en: `Network Access`, ru: `Доступ к сети` }, { en: `Application`, ru: `Прикладной` }]);
  choiceQ('network', `Which layer of the TCP/IP model corresponds to the OSI Transport layer?`, `Какой уровень модели TCP/IP соответствует транспортному уровню OSI?`, { en: `Transport`, ru: `Транспортный` }, [{ en: `Internet`, ru: `Межсетевой` }, { en: `Application`, ru: `Прикладной` }, { en: `Network Access`, ru: `Доступ к сети` }]);
  choiceQ('network', `The TCP/IP Application layer corresponds to which OSI layers?`, `Прикладному уровню TCP/IP соответствуют какие уровни OSI?`, { en: `OSI layers 5, 6, and 7`, ru: `Уровни OSI 5, 6 и 7` }, [{ en: `OSI layers 1 and 2`, ru: `Уровни OSI 1 и 2` }, { en: `OSI layers 3 and 4`, ru: `Уровни OSI 3 и 4` }, { en: `OSI layers 2, 3, and 4`, ru: `Уровни OSI 2, 3 и 4` }]);
  choiceQ('network', `The TCP/IP Network Access layer corresponds to which OSI layers?`, `Уровню доступа к сети TCP/IP соответствуют какие уровни OSI?`, { en: `OSI layers 1 and 2`, ru: `Уровни OSI 1 и 2` }, [{ en: `OSI layers 5, 6, and 7`, ru: `Уровни OSI 5, 6 и 7` }, { en: `OSI layers 3 and 4`, ru: `Уровни OSI 3 и 4` }, { en: `OSI layer 4 only`, ru: `Только уровень OSI 4` }]);
  choiceQ('network', `Which protocols belong to the TCP/IP Internet layer?`, `Какие протоколы относятся к межсетевому уровню TCP/IP?`, { en: `IP, ICMP, and ARP`, ru: `IP, ICMP и ARP` }, [{ en: `TCP and UDP`, ru: `TCP и UDP` }, { en: `HTTP and DNS`, ru: `HTTP и DNS` }, { en: `Ethernet and Wi-Fi`, ru: `Ethernet и Wi-Fi` }]);
  choiceQ('network', `Which protocols belong to the TCP/IP Transport layer?`, `Какие протоколы относятся к транспортному уровню TCP/IP?`, { en: `TCP and UDP`, ru: `TCP и UDP` }, [{ en: `IP and ICMP`, ru: `IP и ICMP` }, { en: `HTTP and FTP`, ru: `HTTP и FTP` }, { en: `ARP and Ethernet`, ru: `ARP и Ethernet` }]);
  choiceQ('network', `Which protocol provides reliable, connection-oriented delivery?`, `Какой протокол обеспечивает надёжную доставку с установкой соединения?`, { en: `TCP`, ru: `TCP` }, [{ en: `UDP`, ru: `UDP` }, { en: `IP`, ru: `IP` }, { en: `ICMP`, ru: `ICMP` }]);
  choiceQ('network', `Which protocol provides fast, connectionless delivery?`, `Какой протокол обеспечивает быструю доставку без установки соединения?`, { en: `UDP`, ru: `UDP` }, [{ en: `TCP`, ru: `TCP` }, { en: `IP`, ru: `IP` }, { en: `ARP`, ru: `ARP` }]);
  choiceQ('network', `Which TCP/IP layer combines the functions of OSI Session, Presentation, and Application layers?`, `Какой уровень TCP/IP объединяет функции сеансового, представительского и прикладного уровней OSI?`, { en: `Application`, ru: `Прикладной` }, [{ en: `Transport`, ru: `Транспортный` }, { en: `Internet`, ru: `Межсетевой` }, { en: `Network Access`, ru: `Доступ к сети` }]);
  choiceQ('network', `In the five-layer TCP/IP model, which two layers replace the single Network Access layer?`, `В пятиуровневой модели TCP/IP какие два уровня заменяют единый уровень доступа к сети?`, { en: `Data Link and Physical`, ru: `Канальный и Физический` }, [{ en: `Session and Presentation`, ru: `Сеансовый и Представительский` }, { en: `Network and Transport`, ru: `Сетевой и Транспортный` }, { en: `Application and Transport`, ru: `Прикладной и Транспортный` }]);
  choiceQ('network', `As data moves down the layers, what is added at each layer?`, `При движении данных вниз по уровням что добавляется на каждом уровне?`, { en: `A header (plus a trailer at the data link layer)`, ru: `Заголовок (плюс трейлер на канальном уровне)` }, [{ en: `A trailer only`, ru: `Только трейлер` }, { en: `Nothing, the data is unchanged`, ru: `Ничего, данные не меняются` }, { en: `Compression information`, ru: `Информация о сжатии` }]);
  choiceQ('network', `What is the PDU (data unit) name at the Transport layer?`, `Как называется единица данных (PDU) на транспортном уровне?`, { en: `Segment`, ru: `Сегмент` }, [{ en: `Packet`, ru: `Пакет` }, { en: `Frame`, ru: `Кадр` }, { en: `Bits`, ru: `Биты` }]);
  choiceQ('network', `What is the PDU (data unit) name at the Network layer?`, `Как называется единица данных (PDU) на сетевом уровне?`, { en: `Packet`, ru: `Пакет` }, [{ en: `Segment`, ru: `Сегмент` }, { en: `Frame`, ru: `Кадр` }, { en: `Bits`, ru: `Биты` }]);
  choiceQ('network', `What is the PDU (data unit) name at the Data Link layer?`, `Как называется единица данных (PDU) на канальном уровне?`, { en: `Frame`, ru: `Кадр` }, [{ en: `Packet`, ru: `Пакет` }, { en: `Segment`, ru: `Сегмент` }, { en: `Bits`, ru: `Биты` }]);
  choiceQ('network', `What is the PDU (data unit) name at the Physical layer?`, `Как называется единица данных (PDU) на физическом уровне?`, { en: `Bits`, ru: `Биты` }, [{ en: `Frames`, ru: `Кадры` }, { en: `Packets`, ru: `Пакеты` }, { en: `Segments`, ru: `Сегменты` }]);
  choiceQ('network', `What is the correct encapsulation order from top to bottom?`, `Каков правильный порядок инкапсуляции сверху вниз?`, { en: `Data -> Segment -> Packet -> Frame -> Bits`, ru: `Данные -> Сегмент -> Пакет -> Кадр -> Биты` }, [{ en: `Bits -> Frame -> Packet -> Segment -> Data`, ru: `Биты -> Кадр -> Пакет -> Сегмент -> Данные` }, { en: `Data -> Packet -> Segment -> Frame -> Bits`, ru: `Данные -> Пакет -> Сегмент -> Кадр -> Биты` }, { en: `Segment -> Data -> Frame -> Packet -> Bits`, ru: `Сегмент -> Данные -> Кадр -> Пакет -> Биты` }]);
  choiceQ('network', `What is the process of removing headers as data moves up the stack called?`, `Как называется процесс удаления заголовков при движении данных вверх по стеку?`, { en: `De-encapsulation`, ru: `Декапсуляция` }, [{ en: `Fragmentation`, ru: `Фрагментация` }, { en: `Encapsulation`, ru: `Инкапсуляция` }, { en: `Multiplexing`, ru: `Мультиплексирование` }]);
  choiceQ('network', `Which statement best describes a key difference between the OSI and TCP/IP models?`, `Какое утверждение лучше всего описывает ключевое различие моделей OSI и TCP/IP?`, { en: `OSI has 7 theoretical layers; TCP/IP has 4 layers mapped to real protocols`, ru: `OSI имеет 7 теоретических уровней; TCP/IP — 4 уровня, соответствующих реальным протоколам` }, [{ en: `OSI is used by the Internet; TCP/IP is only theoretical`, ru: `OSI используется в Интернете; TCP/IP лишь теоретическая` }, { en: `Both models have exactly 7 layers`, ru: `Обе модели имеют ровно 7 уровней` }, { en: `TCP/IP has more layers than OSI`, ru: `В TCP/IP больше уровней, чем в OSI` }]);
  choiceQ('network', `How do the layer counts of the two models compare?`, `Как соотносятся количества уровней двух моделей?`, { en: `OSI has 7 layers; TCP/IP has 4`, ru: `В OSI 7 уровней; в TCP/IP — 4` }, [{ en: `OSI has 4 layers; TCP/IP has 7`, ru: `В OSI 4 уровня; в TCP/IP — 7` }, { en: `Both have 5 layers`, ru: `Обе имеют 5 уровней` }, { en: `Both have 7 layers`, ru: `Обе имеют 7 уровней` }]);
  textQ('network', `How many layers are in the OSI model?`, `Сколько уровней в модели OSI?`, `7`, `7`);
  textQ('network', `How many layers are in the TCP/IP model?`, `Сколько уровней в модели TCP/IP?`, `4`, `4`);
  textQ('network', `What does OSI stand for?`, `Как расшифровывается OSI?`, `Open Systems Interconnection`, `Взаимодействие открытых систем`);
  textQ('network', `Name the four TCP/IP layers from top to bottom.`, `Назовите четыре уровня TCP/IP сверху вниз.`, `Application, Transport, Internet, Network Access`, `Прикладной, Транспортный, Межсетевой, Доступ к сети`);
  textQ('network', `What is the data unit (PDU) name at the Data Link layer?`, `Как называется единица данных (PDU) на канальном уровне?`, `Frame`, `Кадр`);
  textQ('network', `At which OSI layer does TCP operate?`, `На каком уровне OSI работает TCP?`, `Transport (Layer 4)`, `Транспортный (уровень 4)`);
  textQ('network', `At which OSI layer does IP operate?`, `На каком уровне OSI работает IP?`, `Network (Layer 3)`, `Сетевой (уровень 3)`);
  textQ('network', `Which OSI layer handles encryption and compression?`, `Какой уровень OSI выполняет шифрование и сжатие?`, `Presentation (Layer 6)`, `Уровень представления (уровень 6)`);
  textQ('network', `What is the process of adding headers as data moves down the stack called?`, `Как называется процесс добавления заголовков при движении данных вниз по стеку?`, `Encapsulation`, `Инкапсуляция`);
  textQ('network', `Which model has a Network Access layer, OSI or TCP/IP?`, `В какой модели есть уровень доступа к сети — OSI или TCP/IP?`, `TCP/IP`, `TCP/IP`);
}

const finalQuestions = shuffle(questions);

const targetPath = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true });
}

fs.writeFileSync(path.join(targetPath, 'questions.json'), JSON.stringify(finalQuestions, null, 2));
console.log(`Generated ${finalQuestions.length} unique questions.`);
