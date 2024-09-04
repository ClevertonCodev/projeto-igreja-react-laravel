<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body>

    <main id="app" >
            <App :email-verified="{{isset($emailVerified) ? $emailVerified : 'null' }}" />
    </main>
    @vite('resources/js/app.js')
</body>
</html>
