<?php
/**
 * The front page tempate
 *
 * It is used to display a front-page, you can also assign a static page from setting.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage haguwa
 * @since 1.0
 */

get_header();
?>

	<section id="primary" class="content-area">
        <main id="main" class="site-main">
		<?php
        if ( have_posts() ) {

            // Load posts loop.
            while ( have_posts() ) {
                the_post();
				get_template_part( 'template-parts/content/content', 'frontpage' );
			}

			// Previous/next page navigation.
			haguwa_the_posts_navigation();

		} else {

			// If no content, include the "No posts found" template.
			get_template_part( 'template-parts/content/content', 'none' );

		}
		?>

		</main><!-- .site-main -->
	</section><!-- .content-area -->

<?php
get_footer();
