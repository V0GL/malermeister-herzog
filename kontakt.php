<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html#kontakt', true, 303);
    exit;
}

function clean_field(string $value): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);

    return $value;
}

if (!empty($_POST['website'] ?? '')) {
    header('Location: index.html?kontakt=ok#kontakt', true, 303);
    exit;
}

$name = clean_field((string) ($_POST['name'] ?? ''));
$telefon = clean_field((string) ($_POST['telefon'] ?? ''));
$nachricht = trim((string) ($_POST['nachricht'] ?? ''));
$datenschutz = isset($_POST['datenschutz']);

if ($name === '' || $telefon === '' || $nachricht === '' || !$datenschutz) {
    header('Location: index.html?kontakt=fehler#kontakt', true, 303);
    exit;
}

$to = 'info@malermeister-herzog.de';
$subject = 'Neue Anfrage über malermeister-herzog.de';
$body = "Neue Kontaktanfrage über die Website\n\n"
    . "Name: {$name}\n"
    . "Telefon: {$telefon}\n\n"
    . "Nachricht:\n{$nachricht}\n";

$headers = implode("\r\n", [
    'From: Malermeister Herzog <info@malermeister-herzog.de>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
]);

$sent = mail($to, $subject, $body, $headers);

header('Location: index.html?kontakt=' . ($sent ? 'ok' : 'fehler') . '#kontakt', true, 303);
exit;
