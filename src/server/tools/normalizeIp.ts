import net from 'node:net';

export function normalizeIP(ip: string): string {
    // Проверяем, является ли IP-адрес IPv4-mapped IPv6 (начинается с ::ffff:)
    if (ip.startsWith('::ffff:')) {
        return ip.split('::ffff:')[1]; // Возвращаем IPv4-часть
    }

    // Если это просто IPv6-адрес, можем оставить его без изменений
    if (net.isIP(ip) === 6) {
        return ip;
    }

    // Если это обычный IPv4-адрес
    return ip;
}
