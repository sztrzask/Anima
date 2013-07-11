function anima()
{
    var god = this,
        context,
        mouse = {
            x: -99999,
            y: -99999
        },
        isTouchingScreen = false,
        minForce = 0,
        maxForce = 500,
        time = +new Date().getTime(),
        FPS = 60,
        body = document.querySelector( 'body' );
    this.nodeTree = null;
    this.addNode = function ( message, timeout, animation )
    {
        if ( !!( god.nodeTree ) )
        {
            var current = god.nodeTree;
            while ( current.next !== false )
            {
                current = god.nodeTree.next;
            }
            current.next = new node( message, timeout, animation );
        } else
        {
            god.nodeTree = new node( message, timeout, animation );
        }
        return god;
    };
    var node = function ( message, timeout, animation )
    {
        return {
            message: message,
            timeout: timeout,
            animation: animation,
            next: false,
            then: function () { }
        };
    };

    this.then = function ( callback )
    {
        callback = callback || function ( god ) { };
        if ( !!( god.nodeTree ) )
        {
            var current = god.nodeTree;
            while ( current.next !== false )
            {
                current = god.nodeTree.next;
            }
            current.then = callback;
        }
        return god;
    };

    this.options = {
        particles: [],
        canvas: '',
        box: '',
        colors: [],
        audio: '',
        maxParticles: 100
    };

    this.setMaxParticles = function ( max )
    {
        god.options.maxParticles = max;
        createParticles();
    }
    this.setSoundtrack = function ( name )
    {
        /// <summary>Set soundtrack from predefined list or by href</summary>
        /// <param name="name" type="String">Soundtrack to set. Provide valid src or choose one from the predefined:
        ///  &#10; 'kira' for kira fled the district
        ///  &#10; 'daydream' for living the daydream inst
        ///  &#10; 'wire' for 'thewire'
        ///  &#10; 'helium' for 'helium hues'
        ///  &#10; 'winter' for 'winter empire'
        /// </param>
        var audio = document.querySelector( 'audio' );
        if ( !audio )
        {
            audio = document.createElement( 'audio' );
            audio.removeAttribute( 'controls' );
            audio.loop = true;
            audio.volume = 0.5;
        }
        body.appendChild( audio );

        audio.src = name;
        god.options.audio = audio;

        return god;
    };
    this.playMusic = function ()
    {
        var audio = document.querySelector( 'audio' );
        audio.play();

        return god;
    };
    this.setParticleColors = function ( colors )
    {
        god.options.colors = colors;
        if ( god.options.particles.length )
        {
            for ( var i = 0; i < god.options.particles.length; i++ )
            {
                god.options.particles[i].color = god.options.colors[~~( Math.random() * god.options.colors.length )]
            }
        }
        return god;
    };
    this.setBackgroundColor = function ( from, to )
    {
        from = from || '#B1E5DF';
        to = to || '#68C0CC';
        god.options.canvas.width = window.innerWidth;
        god.options.canvas.height = window.innerHeight;
        var pref = ['', '-webkit-', '-moz-', '-ms-', '-o'];
        pref.forEach( function ( e, i )
        {
            god.options.canvas.style.background = e + 'radial-gradient(' + from + ', ' + to + ')';
        } );

        return god;
    };
    this.play = function ()
    {
        pulse();
        return god;
    };

    this.currentNode = null;

    this.updateBox = function ( message )
    {
        god.options.box.innerHTML = '<p><span>' + message + '</span></p>';
    }
    /*
     * Utils
     */

    function isModernEnough()
    {
        /// <summary>Checks if browser is modern enought to use 2d canvas. As far it's not IE8 or less, it's modern enough.</summary>
        return god.options.canvas.getContext && god.options.canvas.getContext( '2d' );
    }

    function abs( x )
    {
        var b = x >> 31;
        return ( x ^ b ) - b;
    }
    function applyTouch( event )
    {
        event.preventDefault();
        isTouchingScreen = true;
    }
    function noTouch( event )
    {
        event.preventDefault();
        isTouchingScreen = false;
    }
    function mouseMove( event )
    {
        event.preventDefault();
        mouse.x = event.pageX - god.options.canvas.offsetLeft;
        mouse.y = event.pageY - god.options.canvas.offsetTop;
    }
    function touchMove( event )
    {
        event.preventDefault();
        mouse.x = event.touches[0].pageX - god.options.canvas.offsetLeft;
        mouse.y = event.touches[0].pageY - god.options.canvas.offsetTop;
    }
    function initialize()
    {
        god.options.canvas = document.createElement( 'canvas' ),
        god.options.box = document.createElement( 'div' );
        god.options.box.className = 'box';
        body.appendChild( god.options.canvas );
        body.appendChild( god.options.box );
        if ( !!( isModernEnough ) )
        {
            context = god.options.canvas.getContext( '2d' );
            window.onresize = function ()
            {
                god.options.canvas.width = window.innerWidth;
                god.options.canvas.height = window.innerHeight;
            };
            if ( 'ontouchstart' in window )
            {
                document.addEventListener( 'touchstart', applyTouch, false );
                document.addEventListener( 'touchend', noTouch, false );
                document.addEventListener( 'touchmove', touchMove, false );
            } else
            {
                document.addEventListener( 'mousedown', applyTouch, false );
                document.addEventListener( 'mouseup', noTouch, false );
                document.addEventListener( 'mousemove', mouseMove, false );
            }
        } else
        {
            //TODO, browser does not support canvas
        }
        createParticles();
    }
  
    var clear = function ()
    {
        var particle = this,
            width = ( 2 * particle.radius ) + 4,
            ceiling = ( width << 0 === width ? width : ( ( width << 0 ) + 1 ) ),
            x = particle.x - ( width / 2 ),
            y = particle.y - ( width / 2 );

        context.clearRect( ~~( x ), ~~( y ), ceiling, ceiling );
    };
    /*
     * Create god.options.particles.
     */

    function createParticles()
    {
        for ( var quantity = 0, len = god.options.maxParticles; quantity < len; quantity++ )
        {
            var x = 10 + ( window.innerWidth || canvas.width ) / len * quantity,
                y = ( window.innerHeight || canvas.height ) / 2,
                radius = ~~( Math.random() * 15 );
            god.options.particles.push( {
                x: x,
                y: y,
                goalX: x,
                goalY: y,
                top: 4 + Math.random() * -8,
                bottom: -15 + Math.random() * -20,
                left: -15 + Math.random() * -20,
                right: -5 + Math.random() * -10,
                radius: radius,
                color: god.options.colors[~~( Math.random() * god.options.colors.length )],
                clear: clear
            } );
        }
    }
    function render()
    {
        god.options.particles.forEach( function ( particle, index )
        {
            context.save();
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc( particle.x, particle.y, particle.radius, 0, Math.PI * 2 );
            context.closePath();
            context.fill();
            context.restore();
        } );
    }
    function pulse()
    {
        update();
        render();
        requestAnimFrame( pulse );
    }
    function checkBounds()
    {
        god.options.particles.forEach( function ( particle, index )
        {
            // Bounds right
            if ( particle.x > god.options.canvas.width + particle.radius * 2 )
            {
                particle.goalX = -particle.radius;
                particle.x = -particle.radius;
            }
            // Bounds bottom
            if ( particle.y > god.options.canvas.height + particle.radius * 2 )
            {
                particle.goalY = -particle.radius;
                particle.y = -particle.radius;
            }
            // Bounds left
            if ( particle.x < -particle.radius * 2 )
            {
                particle.radius *= 4;

                particle.goalX = god.options.canvas.width + particle.radius;
                particle.x = god.options.canvas.width + particle.radius;
            }
            // Bounds top
            if ( particle.y < -particle.radius * 2 )
            {
                particle.radius *= 4;
                particle.goalY = god.options.canvas.height + particle.radius;
                particle.y = god.options.canvas.height + particle.radius;
            }
        } );
    }

    function devilsCurve( particle, steps, center, x, y )
    {
        maxForce = 500;
        var base = ( Math.sqrt(( Math.pow( Math.sin( steps ), 2 ) - 10 * Math.pow( Math.cos( steps ), 2 ) ) / ( Math.pow( Math.sin( steps ), 2 ) - Math.pow( Math.cos( steps ), 2 ) ) ) );
        particle.goalX = center.x + x * Math.cos( steps ) * base;
        particle.goalY = center.y + y * Math.sin( steps ) * base;
    }
    function heartCurve( particle, center, index )
    {
        maxForce = 700;
        particle.goalX = center.x + 180 * Math.pow( Math.sin( index ), 3 );
        particle.goalY = center.y + 10 * ( -( 15 * Math.cos( index ) - 5 * Math.cos( 2 * index ) - 2 * Math.cos( 3 * index ) - Math.cos( 4 * index ) ) );
    }
    function bottomToTop( particle )
    {
        maxForce = 2500;
        particle.goalX += particle.top;
        particle.goalY += particle.bottom;
        checkBounds();
    }
    function rightToLeft( particle )
    {
        maxForce = 2500;
        particle.goalX += particle.bottom;
        particle.goalY += particle.top;
        checkBounds();
    }
    function bottomRightToTopLeft( particle )
    {
        maxForce = 500;
        particle.goalX += particle.left;
        particle.goalY += particle.right;

        checkBounds();
    }
    function circle( particle, center, steps, radius )
    {
        maxForce = 500;
        particle.goalX = ( center.x + radius * Math.cos( steps ) );
        particle.goalY = ( center.y + radius * Math.sin( steps ) );
    }
    function spiral( particle, index, center, radius )
    {
        maxForce = 725;
        var angle = index * 0.2;
        particle.goalX = ( center.x + ( angle * radius ) * Math.cos( angle ) );
        particle.goalY = ( center.y + ( angle * radius ) * Math.sin( angle ) );
    }
    function slowBidirectionalTopBottom( particle )
    {
        maxForce = 2000;
        particle.goalX += particle.top;
        particle.goalY += particle.top;
        checkBounds();
    }
    function fastBottomRightToTopLeft( particle )
    {
        maxForce = 2500;
        particle.goalX += particle.bottom;
        particle.goalY += particle.bottom;
        checkBounds();
    }
    function vaginaCurve( particle, center, steps, radius )
    {
        maxForce = 500;
        particle.goalX = ( center.x + radius * Math.cos( steps ) );
        particle.goalY = ( center.y + radius * Math.tan( steps ) );
    }
    function straightLine( particle, canvas, index )
    {
        maxForce = 500;
        particle.goalX = 10 + canvas.width / 100 * index;
        particle.goalY = canvas.height / 2;
    }

    function moveParticle( particle, angle )
    {
        if ( !!isTouchingScreen )
            minForce = Math.min( minForce + 5, 2000 );
        else
            minForce = Math.max( minForce - 5, 0 );
        var dst = distanceTo( particle, mouse ),
            dist = ( minForce + maxForce ) / dst;
        particle.x += Math.cos( angle ) * dist + ( particle.goalX - particle.x ) * 0.08;
        particle.y += Math.sin( angle ) * dist + ( particle.goalY - particle.y ) * 0.08;
        pulsateParticle( particle );
    }
    function pulsateParticle( particle )
    {
        particle.radius *= 0.96;
        if ( particle.radius <= 2 )
            particle.radius = ~~( Math.random() * 15 );
    }

    function update()
    {
        for ( var i = 0; i < 10; i++ )
        {
            var k = function () { };
        }

        if ( god.currentNode == null )
        {
            god.currentNode = god.nodeTree;
            //updatebox
            god.updateBox( god.currentNode.message )
            //change animation
            time = +new Date().getTime();
        }
        if ( +new Date().getTime() - time > god.currentNode.timeout )
        {
            //trigger then
            god.currentNode.then( god );
            //move node
            if ( god.currentNode.next )
                god.currentNode = god.currentNode.next;
            else
                god.currentNode = god.nodeTree;

            //updatebox
           
            //change animation
           
            time = +new Date().getTime();
        }

        god.options.particles.forEach( function ( particle, index )
        {
            particle.clear();
            var angle,
                steps,
                center = {};
            angle = Math.atan2( particle.y - mouse.y, particle.x - mouse.x );
            steps = Math.PI * 2 * index / god.options.particles.length;
            center.x = ( innerWidth || god.options.canvas.width ) * 0.5;
            center.y = ( innerHeight || god.options.canvas.height ) * 0.5;
            moveParticle( particle, angle );

            /*
            bottomToTop(particle);

            circle(particle, center, steps, 200);

            heartCurve(particle, center, index);

            devilsCurve(particle, steps, center, 180, 87);

            spiral(particle, index, center, 15);
            bottomRightToTopLeft(particle);

            rightToLeft(particle);
            vaginaCurve(particle, center, steps, 200);
            */
            straightLine( particle, god.options.canvas, index );
        } );
    }
    function distanceTo( pointA, pointB )
    {
        var dx = abs( pointA.x - pointB.x ),
            dy = abs( pointA.y - pointB.y );
        return Math.sqrt( dx * dx + dy * dy );
    }

    window.requestAnimFrame = ( function ()
    {
        /*
         * Request new frame by Paul Irish.
         * 60 FPS.
         */
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( callback )
            {
                window.setTimeout( callback, 1000 / FPS );
            };
    } )();

    initialize();
    return god;
}

function start()
{
    var t = 3000;
    var animation = new anima()
        .setSoundtrack( '../audio/danosongs.com-living-the-daydream-instr.mp3' )
        .playMusic()
        .setParticleColors( ['#553bb2', '#eff63a', '#e14743'] )
        .addNode( '1', 2000, '3' )
        .addNode( '4', 1000, '6' )
        .then( function ( e )
        {
            console.log( e );
        } )
        .setBackgroundColor( '#fff', '#eff6e6' )
        .play();
}
window.addEventListener ? window.addEventListener( 'load', start, false ) : window.onload = start;